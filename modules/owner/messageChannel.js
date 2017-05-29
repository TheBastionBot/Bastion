/**
 * @file messageChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!/^[0-9]{18}$/.test(args[0])) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (Bastion.channels.get(args[0])) {
    Bastion.channels.get(args[0]).send({
      embed: {
        color: Bastion.colors.blue,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'msgc' ],
  enabled: true
};

exports.help = {
  name: 'messagechannel',
  description: 'Sends a message to a specified channel (by ID) of a server the bot is connected tos.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'messageChannel <channel_id> <message>',
  example: [ 'messageChannel CHANNEL_ID Hello everyone!' ]
};
