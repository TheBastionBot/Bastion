/**
 * @file shutdown command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    let confirmation = await message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: 'Are you sure you want to shut me down?'
      }
    });

    const collector = confirmation.channel.createMessageCollector(m =>
      Bastion.credentials.ownerId.includes(m.author.id) && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')),
      {
        time: 30 * 1000,
        maxMatches: 1
      }
    );

    collector.on('collect', async answer => {
      try {
        if (answer.content.toLowerCase().startsWith('yes')) {
          await message.channel.send({
            embed: {
              description: 'GoodBye :wave:! See you soon.'
            }
          });

          await Bastion.destroy();
          process.exit(0);
        }
        else {
          await message.channel.send({
            embed: {
              description: 'Cool! I\'m here.'
            }
          });
        }
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
