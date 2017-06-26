/**
 * @file addFav command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const jsonDB = require('node-json-db');
const db = new jsonDB('./data/favouriteSongs', true, true);

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.join(' ');
  try {
    db.reload();
    db.push('/', [ args ], false);
  }
  catch (e) {
    Bastion.log.error(e.stack);
  }
  finally {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Added song to favourites',
        description: args
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'addfav',
  description: string('addFav', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'addfav <song name | song link>',
  example: [ 'addFav one more night', 'addFav https://www.youtube.com/watch?v=JGwWNGJdvx8' ]
};
