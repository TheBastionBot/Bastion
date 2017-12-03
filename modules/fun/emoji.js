/**
 * @file emoji command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const fs = require('fs');

exports.exec = (Bastion, message, args) => {
  if (!args.name && !args.list) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (args.name) {
    args.name = args.name.toLowerCase();
    fs.stat(`./data/emojis/${args.name}.png`, (error, stat) => {
      /**
       * If the emoji doesn't exist or is not readable, just return.
       */
      if (error) return;

      /**
       * If the emoji exists, send the emoji.
       */
      if (stat) {
        message.channel.send({
          files: [ `./data/emojis/${args.name}.png` ]
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    });
  }
  else {
    fs.readdir('./data/emojis', (error, emojis) => {
      if (error) return;

      /**
       * Trim the extentions of the emojis.
       */
      emojis = emojis.map(e => e.substr(0, e.length - 4));

      /**
       * Send the list of emojis available.
       */
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Bastion Emojis',
          description: emojis.join(', ')
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    });
  }
};

exports.config = {
  aliases: [ 'emote' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'list', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'emoji',
  botPermission: '',
  userTextPermission: 'ADD_REACTIONS',
  userVoicePermission: '',
  usage: 'emoji < emoji_name | --list >',
  example: [ 'emoji yum', 'emoji --list' ]
};
