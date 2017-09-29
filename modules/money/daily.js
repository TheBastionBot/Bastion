/**
 * @file daily command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */
const string = require('../../handlers/languageHandler');

let recentUsers = [];
const COOLDOWN = 24;

exports.run = async (Bastion, message) => {
  if (!recentUsers.includes(message.author.id)) {
    let user = message.mentions.users.first() || message.author;
    if (!user) return;


    try {
      let profile = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`);
      if (!profile) {
        await Bastion.db.run('INSERT INTO profiles (userID, BastionCurrencies) VALUES (?, ?)', [ user.id, 0 ]);
      }
      else {
        
        await Bastion.db.run(`UPDATE profiles SET bastionCurrencies=${parseInt(profile.bastionCurrencies) + parseInt(200)} WHERE userID=${user.id}`);
      }

      recentUsers.push(message.author.id);
      setTimeout(() => {
        recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
      }, COOLDOWN * 60 * 60 * 1000);
      if(user.id !== message.author.id) {
      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `**${message.author}** has given **200** daily points to **${user.tag}**!`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    } else {
      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `**${message.author}** has claimed his **200** daily credits!`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
     }
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('cooldown', 'errors'), `You have recently claimed your daily credit, please wait at least ${COOLDOWN} hours before trying again.`, message.channel);
  }
};

exports.config = {
  aliases: [ 'dl' ],
  enabled: true
};

exports.help = {
  name: 'daily',
  description: 'Claim your daily credits',
  botPermission: '',
  userPermission: '',
  usage: 'daily or daily <@USER_MENTION>',
  example: [ 'daily @Vertex#7730' ]
};
