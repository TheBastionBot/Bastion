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

  if (!channel.permissionsFor(message.member).has(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
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
  botPermission: 'MANAGE_CHANNELS',
  userPermission: 'MANAGE_CHANNELS',
  usage: 'setTopic [#channel-mention] [Channel Topic]',
  example: [ 'setTopic #channel-name New Topic', 'setTopic New Topic', 'setTopic' ]
};
