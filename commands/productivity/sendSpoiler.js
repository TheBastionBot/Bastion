/**
 * @file sendSpoiler command
 * @author Alexandre Hamel (a.k.a hamelatoire)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.deletable) {
    await message.delete().catch(() => {});
  }

  await message.channel.send({
    embed: {
      color: message.client.colors.BLUE,
      author: {
        name: message.author.tag,
        url: message.url
      },
      description: Bastion.methods.rot(args.join(' '), 13),
      fields: [
        {
          name: 'SPOILER ALERT!',
          value: 'This message contains spoilers, so I encoded it. If you are okay with viewing the spoiler, copy the above message and use it with the `showSpoiler` command to see the real content of the message.'
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendSpoiler',
  description: 'If you want to send a spoiler, not everyone wants to read it. So, it\'s better to use this command to send it. People who want to read the spoilers can then use the `showSpoiler` command to read it.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sendSpoiler <SPOILER TEXT>',
  example: [ 'sendSpoiler You know, Thanos was killed by...?' ]
};
