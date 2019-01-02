/**
 * @file setNick command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!message.member.hasPermission('CHANGE_NICKNAME')) return;

  let description;

  if (args.length) {
    await message.guild.me.setNickname(args.join(' '));
    description = `${Bastion.user.username}'s nick is now set to **${args.join(' ')}** on this server.`;
  }
  else {
    await message.guild.me.setNickname('');
    description = `${Bastion.user.username}'s nick has been reset on this server.`;
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: description
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'setn' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setNick',
  description: 'Sets the nickname of Bastion in the current Discord server.',
  botPermission: 'CHANGE_NICKNAME',
  userTextPermission: 'CHANGE_NICKNAME',
  userVoicePermission: '',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
