/**
 * @file deleteAllTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.all('DELETE FROM triggers').then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Deleted all the triggers and responses.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true
};

exports.help = {
  name: 'deletealltriggers',
  description: 'Deletes all the triggers and responses.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'deleteAllTriggers',
  example: []
};
