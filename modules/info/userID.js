/**
 * @file userID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      fields: [
        {
          name: 'User',
          value: user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: user.id,
          inline: true
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'uid' ],
  enabled: true
};

exports.help = {
  name: 'userid',
  description: string('userID', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'userID [@user-mention]',
  example: [ 'userID @user#0001', 'userID' ]
};
