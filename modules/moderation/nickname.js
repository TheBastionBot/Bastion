/**
 * @file nickname command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');

  args = args.slice(1);
  let color;
  let nickStat = '';
  if (args.length < 1) {
    color = Bastion.colors.red;
    nickStat = `${user}'s nickname removed.`;
  }
  else {
    color = Bastion.colors.green;
    nickStat = `${user}'s nickname changed.`;
  }
  message.guild.members.get(user.id).setNickname(args.join(' ')).then(() => {
    message.channel.send({
      embed: {
        color: color,
        description: nickStat
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'nick' ],
  enabled: true
};

exports.help = {
  name: 'nickname',
  description: 'Change the nickname of the mentioned user in the server to a specified nick. If no nick is specified, it resets the user\'s nickname.',
  botPermission: 'MANAGE_NICKNAMES',
  userPermission: 'MANAGE_NICKNAMES',
  usage: 'nickname <@user-mention> [nick]',
  example: [ 'nickname @user#0001 The Legend', 'nickname @user#0001' ]
};
