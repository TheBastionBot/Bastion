/**
 * @file typingGame command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const typingArticles = require('../../data/typingArticles.json');
let activeChannels = [];

exports.exec = async (Bastion, message) => {
  try {
    if (activeChannels.includes(message.channel.id)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isGameInUse', true, 'typing'), message.channel);
    }

    activeChannels.push(message.channel.id);

    let gameStatsMessage = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Typing Game',
        description: `Game started by ${message.author}. Type the following text and send in this channel ASAP. The first one to do so will be the winner.\nAnd please do not Copy & Paste the text, play fairly.`,
        footer: {
          text: `You have ${5} minutes to make your submission.`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    let index = Bastion.functions.getRandomInt(1, Object.keys(typingArticles).length);
    let articleMessage = await message.channel.send({
      embed: {
        description: typingArticles[index]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    const collector = message.channel.createMessageCollector(
      msg => msg.content === typingArticles[index],
      {
        time: 5 * 60 * 1000,
        maxMatches: 1
      }
    );

    collector.on('end', async (collection, reason) => {
      try {
        let color, result;
        if (reason === 'time') {
          color = Bastion.colors.RED;
          result = 'Game ended. Unfortunately, no one was able to type the article on time.';
        }
        else {
          color = Bastion.colors.BLUE;
          result = `Game ended. Congratulations ${collection.map(m => m.author)[0]}! You won it.`;
        }

        await message.channel.send({
          embed: {
            color: color,
            title: 'Typing Game',
            description: result
          }
        }).catch(e => {
          Bastion.log.error(e);
        });

        gameStatsMessage.delete().catch(e => {
          Bastion.log.error(e);
        });
        articleMessage.delete().catch(e => {
          Bastion.log.error(e);
        });
        activeChannels = activeChannels.slice(activeChannels.indexOf(message.channel.id) + 1, 1);
      }
      catch (e) {
        Bastion.log.error(e);
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'typegame' ],
  enabled: true
};

exports.help = {
  name: 'typingGame',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'typingGame',
  example: []
};
