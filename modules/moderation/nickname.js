/**
 * @file nickname command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userTextPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

  args = args.slice(1);
  let color;
  let nickStat = '';
  if (args.length < 1) {
    color = Bastion.colors.RED;
    nickStat = `${user}'s nickname removed.`;
  }
  else {
    color = Bastion.colors.GREEN;
    nickStat = `${user}'s nickname changed.`;
  }

  try {
    await message.guild.members.get(user.id).setNickname(args.join(' '));

    message.channel.send({
      embed: {
        color: color,
        description: nickStat
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
  aliases: [ 'nick' ],
  enabled: true
};

exports.help = {
  name: 'nickname',
  botPermission: 'MANAGE_NICKNAMES',
  userTextPermission: 'MANAGE_NICKNAMES',
  usage: 'nickname <@user-mention> [nick]',
  example: [ 'nickname @user#0001 The Legend', 'nickname @user#0001' ]
};
