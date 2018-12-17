/**
 * @file messageChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (args.length < 2 || !(parseInt(args[0]) < 9223372036854775807)) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (Bastion.shard) {
    await Bastion.shard.broadcastEval(`
      let channel = this.channels.get('${args[0]}');
      if (channel) {
        channel.send({
          embed: {
            color: this.colors.BLUE,
            description: '${args.slice(1).join(' ').replace('\'', '\\\'')}'
          }
        }).catch(this.log.error);
      }
    `);
  }
  else {
    let channel = Bastion.channels.get(args[0]);
    if (channel) {
      await channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: args.slice(1).join(' ')
        }
      });
    }
    else {
      Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'channel'), message.channel);
    }
  }
};

exports.config = {
  aliases: [ 'msgc' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageChannel',
  description: 'Send a specified message to any specified text channel that Bastion has access to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageChannel <channel_id> <message>',
  example: [ 'messageChannel CHANNEL_ID Hello everyone!' ]
};
