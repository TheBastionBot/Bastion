/**
 * @file enableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  let description;
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

    description = Bastion.strings.info(message.guild.language, 'enableCommand', message.author.tag, command.help.name);
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
    description = Bastion.strings.info(message.guild.language, 'enableAllCommands', message.author.tag);
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
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'enableCommand',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'enableCommand < COMMAND_NAME | --all >',
  example: [ 'enableCommand echo', 'enableCommand --all' ]
};
