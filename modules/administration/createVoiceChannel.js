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
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.join(' ');
  if (args.length < 2) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.red,
      description: 'Channel name should be at least two characters long.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.createChannel(args, 'voice').then(channel => {
    message.channel.sendMessage('', {embed: {
      color: Bastion.colors.green,
      title: 'Voice Channel Created',
      fields: [
        {
          name: 'Name',
          value: channel.name,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['cvc']
};

exports.help = {
  name: 'createvoicechannel',
  description: 'Creates a new voice channel with a given name.',
  permission: 'Manage Channels',
  usage: 'createVoiceChannel <Channel Name>',
  example: ['createVoiceChannel Channel Name']
};
