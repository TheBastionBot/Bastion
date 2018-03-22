/**
 * @file emojiInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args[0].split(':')[1];
  if (!args) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }
  args = message.guild.emojis.find('name', args);

  if (!args) {
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'emoji'), message.channel);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
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
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'einfo' ],
  enabled: true
};

exports.help = {
  name: 'emojiInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'emojiInfo <:emoji:>',
  example: [ 'emojiInfo :bastion:' ]
};
