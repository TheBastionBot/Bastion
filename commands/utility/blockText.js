/**
 * @file blockText command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (args.length < 1) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let blockedChars = args.join(' ').toLowerCase().
    replace(/[a-z]/g, ':regional_indicator_$&:').
    replace(/1/g, ':one:').
    replace(/2/g, ':two:').
    replace(/3/g, ':three:').
    replace(/4/g, ':four:').
    replace(/5/g, ':five:').
    replace(/6/g, ':six:').
    replace(/7/g, ':seven:').
    replace(/8/g, ':eight:').
    replace(/9/g, ':nine:').
    replace(/0/g, ':zero:');

  await message.channel.send(blockedChars);
};

exports.config = {
  aliases: [ 'block' ],
  enabled: true
};

exports.help = {
  name: 'blockText',
  description: 'Sends the given text as text emojis.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'blockText <text>',
  example: [ 'blockText Hello, world!' ]
};
