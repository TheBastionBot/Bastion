/**
 * @file enableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let disabledCommands, description;
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
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
    }

    if (![ 'owner', 'guild_admin' ].includes(command.config.module)) {
      let guildModel = await Bastion.database.models.guild.findOne({
        attributes: [ 'disabledCommands' ],
        where: {
          guildID: message.guild.id
        }
      });
      if (guildModel.dataValues.disabledCommands) {
        if (guildModel.dataValues.disabledCommands.includes(command.help.name.toLowerCase())) {
          guildModel.dataValues.disabledCommands.splice(guildModel.dataValues.disabledCommands.indexOf(command.help.name.toLowerCase()), 1);

          await Bastion.database.models.guild.update({
            disabledCommands: guildModel.dataValues.disabledCommands
          },
          {
            where: {
              guildID: message.guild.id
            },
            fields: [ 'disabledCommands' ]
          });
        }
      }
    }

    description = Bastion.i18n.info(message.guild.language, 'enableCommand', message.author.tag, command.help.name);
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();

    disabledCommands = Bastion.commands.filter(c => c.config.module === args.module).map(c => c.help.name.toLowerCase());

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.disabledCommands) {
      disabledCommands = guildModel.dataValues.disabledCommands.filter(command => !disabledCommands.includes(command));
    }

    description = Bastion.i18n.info(message.guild.language, 'enableModule', message.author.tag, args.module);

    await Bastion.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.all) {
    await Bastion.database.models.guild.update({
      disabledCommands: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
    description = Bastion.i18n.info(message.guild.language, 'enableAllCommands', message.author.tag);
  }
  else {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: description
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'enableCommand',
  description: 'Enable disabled command/module in your server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'enableCommand < COMMAND_NAME | --module MODULE NAME | --all >',
  example: [ 'enableCommand echo', 'enableCommand --module game stats', 'enableCommand --all' ]
};
