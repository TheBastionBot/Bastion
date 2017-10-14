/**
 * @file ping command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  try {
    let responseMessage = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: 'PINGing...'
      }
    });
    await responseMessage.edit({
      embed: {
        color: Bastion.colors.BLUE,
        fields: [
          {
            name: 'Response Time',
            value: `${responseMessage.createdTimestamp - message.createdTimestamp}ms`,
            inline: true
          },
          {
            name: 'WebSocket PING',
            value: `${Bastion.ping}ms`,
            inline: true
          }
        ]
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ping',
  botPermission: '',
  userPermission: '',
  usage: 'ping',
  example: []
};
