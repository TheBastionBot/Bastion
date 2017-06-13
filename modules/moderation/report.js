/**
 * @file report command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id === user.id) return Bastion.log.info('User can\'t report himself.');
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No reason given';
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'User Reported',
      description: `You have reported **${user.tag}** to the moderators for **${reason}**. They will look into it.`
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
  aliases: [ 'k' ],
  enabled: true
};

exports.help = {
  name: 'report',
  description: 'Reports a user to the moderators with a given reason.',
  botPermission: '',
  userPermission: '',
  usage: 'report @user-mention [Reason]',
  example: [ 'report @user#0001 Reason for reporting.' ]
};
