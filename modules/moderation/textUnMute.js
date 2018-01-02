/**
 * @file textUnMute command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user = message.mentions.users.first();
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

      let reason = args.slice(1).join(' ');
      if (reason.length < 1) {
        reason = 'No reason given';
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${message.author.tag} text-unmuted ${user.tag} with reason **${reason}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
      * Logs moderation events if it is enabled
      * @fires moderationLog
      */
      Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason, {
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
  enabled: true
};

exports.help = {
  name: 'textUnMute',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'textUnMute @user-mention [Reason]',
  example: [ 'textUnMute @user#0001 Reason for the unmute.' ]
};
