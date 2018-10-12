/**
 * @file giveXP command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id || !args.points) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (message.mentions.users.size) {
      args.id = message.mentions.users.first().id;
    }

    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: [ 'experiencePoints' ],
      where: {
        userID: args.id,
        guildID: message.guild.id
      }
    });
    if (!guildMemberModel) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'profileNotCreated', `<@${args.id}>`), message.channel);
    }

    args.points = `${parseInt(guildMemberModel.dataValues.experiencePoints) + parseInt(args.points)}`;

    await Bastion.database.models.guildMember.update({
      experiencePoints: args.points
    },
    {
      where: {
        userID: args.id,
        guildID: message.guild.id
      },
      fields: [ 'experiencePoints' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `<@${args.id}> has been awarded with **${args.points}** experience points.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  guildOwnerOnly: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'points', alias: 'n', type: String }
  ]
};

exports.help = {
  name: 'giveXP',
  description: 'Give the specified amount of experience points to the specified user and increase their level.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giveXP <@USER_MENTION | USER_ID> <-n POINTS>',
  example: [ 'giveXP @user#0001 -n 100', 'giveXP 242621467230268813 -n 150' ]
};
