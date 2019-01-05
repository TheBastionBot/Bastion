/**
 * @file showSpoiler command
 * @author Alexandre Hamel (a.k.a hamelatoire)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await message.author.send({
    embed: {
      color: message.client.colors.BLUE,
      title: 'SPOILER ALERT!',
      description: Bastion.methods.rot(args.join(' '), 13),
      footer: {
        text: 'You chose to view this spoiler. Don\'t blame me!'
      }
    }
  });

  await message.channel.send({
    embed: {
      color: message.client.colors.BLUE,
      description: 'Check your direct messages from me to see the spoiler.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'showSpoiler',
  description: 'Decodes the spoiler message, sent via `sendSpoiler` command and sends you the decoded message via DM.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'showSpoiler <ENCODED SPOILER MESSAGE>',
  example: [ 'sendSpoiler Lbh xabj, Gunabf jnf xvyyrq ol...?' ]
};
