/**
 * @file setNick command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length > 0) {
      await message.guild.me.setNickname(args.join(' '));

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s nick is now set to **${args.join(' ')}** on this guild.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await message.guild.me.setNickname('');

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s nick has been reset on this guild.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'setn' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setNick',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
