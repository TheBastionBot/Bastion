/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let modules = [ ...new Set(Bastion.commands.map(c => c.config.module)) ];
    if (args.modules) {
      args.modules = args.modules.filter(module => modules.includes(module));
      if (args.modules.length) {
        modules = args.modules;
      }
    }

    let fields = [], description;
    for (let i = 0; i < modules.length; i++) {
      let commands;
      if (args.all) {
        description = 'To get the list of all the commands with details click [here](https://bastionbot.org/commands).';
        commands = Bastion.commands.filter(c => c.config.module === modules[i]).map(c => c.help.name);
      }
      else {
        description = `Showing a list of commands you have permission for in the #${message.channel.name} channel in ${message.guild.name} server.\n` +
                      'Run `commands --all` command in the server to see the complete list.\n' +
                      'To get the list of all the commands with details click [here](https://bastionbot.org/commands).';
        // TODO: Make this more efficient.
        commands = Bastion.commands.filter(cmd => {
          if (cmd.config.module === modules[i]) {
            if (cmd.help.userTextPermission) {
              if (Object.keys(message.client.permissions).includes(cmd.help.userTextPermission)) {
                if (message.channel.permissionsFor(message.member).has(cmd.help.userTextPermission)) {
                  return true;
                }
                return false;
              }
              else if (cmd.config.ownerOnly) {
                if (Bastion.credentials.ownerId.includes(message.author.id)) {
                  return true;
                }
                return false;
              }
              return true;
            }
            return true;
          }
          return false;
        }).map(c => c.help.name);
      }

      if (commands.length === 0) {
        continue;
      }

      fields.push({
        name: modules[i].replace('_', ' ').toTitleCase(),
        value: commands.join('\n'),
        inline: true
      });
    }

    let authorDMChannel = await message.author.createDM();
    authorDMChannel.send({
      embed: {
        color: Bastion.colors.GOLD,
        title: 'List of Commands',
        description: description,
        fields: fields,
        footer: {
          text: `Server Prefix: ${message.guild.prefix[0]} | Total Commands: ${Bastion.commands.size}`
        }
      }
    });

    message.channel.send({
      embed: {
        description: `${message.author} Check your DM from me, I've sent you the list of commands${args.modules && args.modules.length ? ` in ${args.modules.join(', ')} modules` : ''}.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 50007) {
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `${message.author} You need to allow Direct Message from your Privacy Settings so that I'll be able to DM you with the commands. If you still don't prefer to change your settings, you can view the commands in https://bastionbot.org/commands`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true,
  argsDefinitions: [
    { name: 'modules', type: String, multiple: true, defaultOption: true },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'commands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commands [module names] [--all]',
  example: [ 'commands', 'commands --all', 'commands administration moderation' ]
};
