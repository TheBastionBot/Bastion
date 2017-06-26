/**
 * @file listTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.all('SELECT trigger FROM triggers').then(triggers => {
    if (triggers.length === 0) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', 'Not Found', 'There are not triggers.', message.channel);
    }

    triggers = triggers.map((t, i) => `${i + 1}. ${t.trigger}`);

    let noOfPages = triggers.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        title: 'List of triggers',
        description: triggers.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
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
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listtriggers',
  description: string('listTriggers', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'listTriggers [page_no]',
  example: [ 'listTriggers', 'listTriggers 2' ]
};
