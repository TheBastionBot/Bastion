/**
 * @file setTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let channel = message.mentions.channels.first();
  let topic;
  if (!channel) {
    channel = message.channel;
    topic = args.join(' ');
  }
  else {
    topic = args.slice(1).join(' ').trim();
  }

  if (!channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission, in this channel, to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let color = Bastion.colors.green;
  let title = 'Channel Topic Set';
  if (topic.length < 2) {
    topic = ' ';
    title = 'Channel Topic Removed';
    color = Bastion.colors.red;
  }

  channel.setTopic(topic).then(() => {
    message.channel.send({
      embed: {
        color: color,
        title: title,
        fields: [
          {
            name: 'Channel Name',
            value: `#${channel.name}`,
            inline: true
          },
          {
            name: 'Topic',
            value: channel.topic.length > 1 ? channel.topic : '-',
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
  aliases: [ 'st' ],
  enabled: true
};

exports.help = {
  name: 'settopic',
  description: 'Sets the topic of the mentioned channel with a given name. If no channel is mentioned, sets the topic of the current channel with the given name. If no topic is given, or lenght of the topic is less than 2, channel topic is removed.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'setTopic [#channel-mention] [Channel Topic]',
  example: [ 'setTopic #channel-name New Topic', 'setTopic New Topic', 'setTopic' ]
};
