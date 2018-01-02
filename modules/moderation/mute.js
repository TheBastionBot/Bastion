/**
 * @file mute command
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

    await member.setMute(true);

    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: `${message.author.tag} voice-muted ${user.tag} with reason **${reason}**`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'm' ],
  enabled: true
};

exports.help = {
  name: 'mute',
  botPermission: 'MUTE_MEMBERS',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'mute @user-mention [Reason]',
  example: [ 'mute @user#0001 Reason for the mute.' ]
};
