/**
 * @file shutdown command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let confirmation = await message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: 'Are you sure you want to shut me down?'
      }
    });

    const collector = confirmation.channel.createMessageCollector(m => Bastion.credentials.ownerId.includes(m.author.id) && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')),
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

          if (Bastion.shard) {
            await Bastion.shard.broadcastEval('this.destroy().then(() => process.exitCode = 0)');
          }
          else {
            await Bastion.destroy();
            process.exitCode = 0;
            setTimeout(() => {
              process.exit(0);
            }, 5000);
          }

          Bastion.log.console('\n');
          Bastion.log.info('GoodBye! See you next time.');
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
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'shutdown',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shutdown',
  example: []
};
