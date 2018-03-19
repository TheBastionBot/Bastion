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

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'suggestionChannel' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (!guildModel || !guildModel.dataValues.suggestionChannel) return;

    let suggestionChannel;
    if (guildModel.dataValues.suggestionChannel) {
      suggestionChannel = message.guild.channels.filter(channel => channel.type === 'text').get(guildModel.dataValues.suggestionChannel);
    }

    if (!suggestionChannel) {
      suggestionChannel = message.channel;
    }

    let suggestion = await suggestionChannel.send({
      embed: {
        title: 'Suggestion',
        description: args.description.join(' '),
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
