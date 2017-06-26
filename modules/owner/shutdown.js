/**
 * @file shutdown command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.orange,
      description: 'Are you sure you want to shut me down?'
    }
  }).then(msg => {
    const collector = msg.channel.createMessageCollector(m =>
      Bastion.credentials.ownerId.includes(m.author.id) && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')),
      {
        time: 30 * 1000,
        maxMatches: 1
      }
    );
    collector.on('collect', answer => {
      if (answer.content.toLowerCase().startsWith('yes')) {
        message.channel.send({
          embed: {
            color: Bastion.colors.dark_grey,
            description: 'GoodBye :wave:! See you soon.'
          }
        }).then(() => {
          Bastion.destroy().then(() => {
            process.exit(0);
          }).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      else {
        message.channel.send({
          embed: {
            color: Bastion.colors.dark_grey,
            description: 'Cool! I\'m here.'
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'die', 'turnoff' ],
  enabled: true
};

exports.help = {
  name: 'shutdown',
  description: string('shutdown', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'shutdown',
  example: []
};
