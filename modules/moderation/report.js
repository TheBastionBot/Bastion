/**
 * @file report command
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

  if (message.author.id === user.id) return;

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No reason given';
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'User Reported',
      description: `You have reported ${user.tag} to the moderators with reason **${reason}**. Hold tight, they will look into it.`
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'report',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'report @user-mention [Reason]',
  example: [ 'report @user#0001 Reason for reporting.' ]
};
