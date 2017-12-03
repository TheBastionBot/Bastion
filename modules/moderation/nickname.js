/**
 * @file nickname command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

  let color;
  let nickStat = '';
  if (message.guild.ownerID === message.author.id) {
    color = Bastion.colors.RED;
    nickStat = 'Can\'t change server owner\'s nickname.';
  }
  else {
    args = args.slice(1);
    if (args.length < 1) {
      color = Bastion.colors.RED;
      nickStat = `${user}'s nickname removed.`;
    }
    else {
      color = Bastion.colors.GREEN;
      nickStat = `${user}'s nickname changed.`;
    }
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
  userVoicePermission: '',
  usage: 'nickname <@user-mention> [nick]',
  example: [ 'nickname @user#0001 The Legend', 'nickname @user#0001' ]
};
