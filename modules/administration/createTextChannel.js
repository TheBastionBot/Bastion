/**
 * @file createTextChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('MANAGE_CHANNELS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (args.length < 1) {
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

  args = args.join('-');
  if (args.length < 2) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Channel name should be at least two characters long.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.createChannel(args, 'text').then(channel => {
    channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Text Channel Created',
        fields: [
          {
            name: 'Channel Name',
            value: channel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: channel.id,
            inline: true
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'ctc' ],
  enabled: true
};

exports.help = {
  name: 'createtextchannel',
  description: 'Creates a new text channel with a given name.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'createTextChannel <Channel Name>',
  example: [ 'createTextChannel Channel Name' ]
};
