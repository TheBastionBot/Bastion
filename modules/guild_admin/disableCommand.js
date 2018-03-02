/**
 * @file disableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  let disabledCommands, title, description;
  if (args.name) {
    let command = args.name.toLowerCase();

    if (Bastion.commands.has(command) || Bastion.aliases.has(command)) {
      if (Bastion.commands.has(command)) {
        command = Bastion.commands.get(command);
      }
      else if (Bastion.aliases.has(command)) {
        command = Bastion.commands.get(Bastion.aliases.get(command).toLowerCase());
      }
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
    }

    if ([ 'owner', 'guild_admin' ].includes(command.config.module)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'commandNoDisable', true, command.help.name), message.channel);
    }

    let guildSettings = await Bastion.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (guildSettings.disabledCommands) {
      guildSettings.disabledCommands = guildSettings.disabledCommands.split(' ');
      guildSettings.disabledCommands.push(command.help.name.toLowerCase());
    }
    else {
      guildSettings.disabledCommands = [ command.help.name.toLowerCase() ];
    }

    guildSettings.disabledCommands = [ ...new Set(guildSettings.disabledCommands) ];

    disabledCommands = guildSettings.disabledCommands.join(' ').toLowerCase();
    description = Bastion.strings.info(message.guild.language, 'disableCommand', message.author.tag, command.help.name);

    await Bastion.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();
    if ([ 'owner', 'guild_admin' ].includes(args.module)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), 'You can\'t disable commands in this module.', message.channel);
    }

    disabledCommands = Bastion.commands.filter(c => c.config.module === args.module).map(c => c.help.name).join(' ').toLowerCase();

    let guildSettings = await Bastion.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (guildSettings.disabledCommands) {
      disabledCommands += ` ${guildSettings.disabledCommands}`;
    }

    description = Bastion.strings.info(message.guild.language, 'disableModule', message.author.tag, args.module);

    await Bastion.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else if (args.all) {
    disabledCommands = Bastion.commands.filter(c => ![ 'owner', 'guild_admin' ].includes(c.config.module)).map(c => c.help.name).join(' ').toLowerCase();
    description = Bastion.strings.info(message.guild.language, 'disableAllCommands', message.author.tag);

    await Bastion.db.run(`UPDATE guildSettings SET disabledCommands='${disabledCommands}' WHERE guildID=${message.guild.id}`);
  }
  else {
    let guildSettings = await Bastion.db.get(`SELECT disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);
    title = 'Commands disabled in this server:';
    description = guildSettings.disabledCommands ? guildSettings.disabledCommands.replace(/ /g, ', ') : 'No command has been disabled in this server. Check `help disableCommand` for more info.';
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      title: title,
      description: description
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'disableCommand',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'disableCommand [ COMMAND_NAME | --module MODULE NAME | --all ]',
  example: [ 'disableCommand echo', 'disableCommand --module game stats', 'disableCommand --all' ]
};
