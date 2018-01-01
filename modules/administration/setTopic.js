/**
 * @file setTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let channel = message.mentions.channels.first();
    let topic;
    if (!channel) {
      channel = message.channel;
      topic = args.join(' ');
    }
    else {
      topic = args.slice(1).join(' ').trim();
    }

    if (!channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
    }
    if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
      /**
      * Bastion has missing permissions.
      * @fires bastionMissingPermissions
      */
      return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
    }

    let color;
    let action;
    if (topic.length < 2) {
      topic = ' ';
      action = 'removed';
      color = Bastion.colors.RED;
    }
    else {
      action = 'changed';
      color = Bastion.colors.ORANGE;
    }

    await channel.setTopic(topic);

    await message.channel.send({
      embed: {
        color: color,
        description: `${message.author.tag} ${action} the topic of the text channel **${channel.name}** ${channel.topic.length > 1 ? `to\n\`\`\`${channel.topic}\`\`\`` : ''}`
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'sett' ],
  enabled: true
};

exports.help = {
  name: 'setTopic',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'setTopic [#channel-mention] [Channel Topic]',
  example: [ 'setTopic #channel-name New Topic', 'setTopic New Topic', 'setTopic' ]
};
