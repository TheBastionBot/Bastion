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
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  channel = message.guild.channels.filter(c => c.type === 'voice').find('name', args.join(' '));
  if (channel) {
    if (!channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
    if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission, in this channel, to use this command.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }
  else {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: 'No voice channel found with that name.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  channel.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['dvc'],
  enabled: true
};

exports.help = {
  name: 'deletevoicechannel',
  description: 'Deletes a voice channel by a given name.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'deleteVoiceChannel <Channel Name>',
  example: ['deleteVoiceChannel Voice Channel Name']
};
