/**
 * @file setBio command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let charLimit = 350;
  let bio = args.join(' ').replace('"', '\'');

  if (bio.length > charLimit) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('bioRange', 'errorMessage', charLimit), message.channel);
  }

  Bastion.db.get(`SELECT bio FROM profiles WHERE userID=${message.author.id}`).then(user => {
    if (!user) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your bio.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    Bastion.db.run(`UPDATE profiles SET bio="${bio}" WHERE userID=${message.author.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Bio Set',
          description: bio,
          footer: {
            text: args.tag
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setbio',
  description: string('setBio', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'setBio <text>',
  example: [ 'setBio I\'m awesome. :sunglasses:' ]
};
