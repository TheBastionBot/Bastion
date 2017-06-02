/**
 * @file listTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  sql.all('SELECT trigger FROM triggers').then(triggers => {
    if (triggers.length === 0) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'You don\'t have any triggers.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    triggers = triggers.map((t, i) => `${i + 1}. ${t.trigger}`);
    let i = 0;
    if (isNaN(args = parseInt(args[0]))) {
      i = 1;
    }
    else {
      i = (args > 0 && args < triggers.length / 10 + 1) ? args : 1;
    }
    i = i - 1;
    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        title: 'List of triggers',
        description: triggers.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${parseInt(triggers.length / 10 + 1)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'listtrips' ],
  enabled: true
};

exports.help = {
  name: 'listtriggers',
  description: 'Lists all the triggers you have added. It takes page number as an optional argument.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'listTriggers [page_no]',
  example: [ 'listTriggers', 'listTriggers 2' ]
};
