/**
 * @file suggest command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.description) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildSettings = await Bastion.db.get(`SELECT suggestionChannel FROM guildSettings WHERE guildID=${message.guild.id}`);

    let suggestionChannel;
    if (guildSettings.suggestionChannel) {
      suggestionChannel = message.guild.channels.filter(channel => channel.type === 'text').get(guildSettings.suggestionChannel);
    }

    if (!suggestionChannel) {
      suggestionChannel = message.channel;
    }

    let suggestion = await suggestionChannel.send({
      embed: {
        title: 'Suggestion',
        description: args.description.join(' '),
        image: {
          url: (message.attachments.size && message.attachments.first().height && message.attachments.first().url) || null
        },
        footer: {
          text: `Suggested by ${message.author.tag}`
        }
      }
    });

    // Delete user's message
    if (message.deletable) {
      message.delete().catch(() => {});
    }

    // Add reactions for voting
    await suggestion.react('👍');
    await suggestion.react('👎');
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'description', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'suggest',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'suggest <SUGGESTION>',
  example: [ 'suggest Add a feedback page to the website.' ]
};
