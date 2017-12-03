/**
 * @file clearWarn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No given reason';
  }

  if (!message.guild.warns) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), 'Everyone is decent here, no one has been warned.', message.channel);
  }
  if (!message.guild.warns.hasOwnProperty(user.id)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), `Nah, ${user.tag} is good guy, he hasn't been warned.`, message.channel);
  }

  delete message.guild.warns[user.id];
  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'Warnings Cleared',
      description: `${user}, your warnings have been cleared by ${message.author} for **${reason}**.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  /**
   * Logs moderation events if it is enabled
   * @fires moderationLog
   */
  Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);
};

exports.config = {
  aliases: [ 'warnClear' ],
  enabled: true
};

exports.help = {
  name: 'clearWarn',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'clearWarn @user-mention [Reason]',
  example: [ 'clearWarn @user#0001 Reason for clearing the warning.' ]
};
