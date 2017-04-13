/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args[0].split(':')[1];
  if (!args) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  args = message.guild.emojis.find('name', args);
  message.channel.sendMessage('', {embed: {
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
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['einfo']
};

exports.help = {
  name: 'emojiinfo',
  description: 'Shows information about the mentioned custom emoji.',
  permission: '',
  usage: 'emojiInfo [:emoji:]',
  example: ['emojiInfo :bastion:']
};
