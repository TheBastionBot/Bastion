/**
 * @file emojiInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args[0].split(':')[1];
  if (!args) {
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
  args = message.guild.emojis.find('name', args);
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Emoji info',
      fields: [
        {
          name: 'Name',
          value: args.name,
          inline: true
        },
        {
          name: 'ID',
          value: args.id,
          inline: true
        },
        {
          name: 'Created At',
          value: args.createdAt.toUTCString(),
          inline: true
        }
      ],
      thumbnail: {
        url: args.url
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'einfo' ],
  enabled: true
};

exports.help = {
  name: 'emojiinfo',
  description: 'Shows information about the mentioned custom emoji.',
  botPermission: '',
  userPermission: '',
  usage: 'emojiInfo [:emoji:]',
  example: [ 'emojiInfo :bastion:' ]
};
