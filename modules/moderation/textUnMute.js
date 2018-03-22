/**
 * @file textUnMute command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await Bastion.fetchUser(args.id);
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

    let permissionOverwrites = message.channel.permissionOverwrites.get(user.id);
    if (permissionOverwrites) {
      await permissionOverwrites.delete();

      args.reason = args.reason.join(' ');

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: Bastion.strings.info(message.guild.language, 'textUnmute', message.author.tag, user.tag, args.reason)
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
      * Logs moderation events if it is enabled
      * @fires moderationLog
      */
      Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason, {
        channel: message.channel
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'tum' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'textUnMute',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'textUnMute <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'textUnMute @user#001 -r Apologized', 'textUnMute 167147569575323761 -r Forgiven' ]
};
