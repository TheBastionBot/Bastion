/**
 * @file emojiInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args[0].split(':')[1];
  if (!args) {
    return Bastion.emit('commandUsage', message, this.help);
  }
  args = message.guild.emojis.find(emoji => emoji.name === args);

  if (!args) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'emoji'), message.channel);
  }

  await message.channel.send({
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
  });
};

exports.config = {
  aliases: [ 'einfo' ],
  enabled: true
};

exports.help = {
  name: 'emojiInfo',
  description: 'Shows information of a specified emoji of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'emojiInfo <:emoji:>',
  example: [ 'emojiInfo :bastion:' ]
};
