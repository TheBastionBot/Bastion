/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.message || !(parseInt(args.message) < 9223372036854775807)) {
      return Bastion.emit('commandUsage', message, this.help);
    }

    let channel = message.mentions.channels.first();
    if (!channel) {
      channel = message.channel;
    }

    let citedMessage = await channel.fetchMessage(args.message);

    let image;
    if (citedMessage.attachments.size) {
      if (citedMessage.attachments.first().height) {
        image = citedMessage.attachments.first().url;
      }
    }

    if (!image && !citedMessage.content) {
      return await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          author: {
            name: `${citedMessage.author.tag} ${message.channel.id === citedMessage.channel.id ? '' : `in #${citedMessage.channel.name}`}`,
            icon_url: citedMessage.author.displayAvatarURL
          },
          description: '*The message doesn\'t have any content that can be cited.*',
          fields: [
            {
              name: 'Link to Message',
              value: `[Click here to go to the original message.](${citedMessage.url})`
            }
          ],
          timestamp: citedMessage.createdAt
        }
      });
    }

    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: `${citedMessage.author.tag} ${message.channel.id === citedMessage.channel.id ? '' : `in #${citedMessage.channel.name}`}`,
          icon_url: citedMessage.author.displayAvatarURL
        },
        description: citedMessage.content,
        fields: [
          {
            name: 'Link to Message',
            value: `[Click here to go to the original message.](${citedMessage.url})`
          }
        ],
        image: {
          url: image
        },
        timestamp: citedMessage.createdAt
      }
    });
  }
  catch (e) {
    if (e.toString().includes('Unknown Message')) {
      Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'messageNotFound'), message.channel);
    }
    else {
      throw e;
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'message', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'cite',
  description: 'Cite any message from your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
