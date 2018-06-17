/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.message || !(parseInt(args.message) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
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
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), 'The message doesn\'t have any content that can be cited.', message.channel);
    }

    message.channel.send({
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
            value: `https://discordapp.com/channels/${citedMessage.guild.id}/${citedMessage.channel.id}/${citedMessage.id}`
          }
        ],
        image: {
          url: image
        },
        timestamp: citedMessage.createdAt
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.toString().includes('Unknown Message')) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'messageNotFound', true), message.channel);
    }
    else {
      Bastion.log.error(e);
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
