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

exports.run = function(Bastion, message, args) {
  channel = message.guild.channels.filter(c => c.type == 'voice').find('name', args.join(' '));
  if (!channel.permissionsFor(message.author).hasPermission("MANAGE_CHANNELS")) return Bastion.log.info('You don\'t have permissions to use this command.');

  channel.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['dvc']
};

exports.help = {
  name: 'deletevoicechannel',
  description: 'Deletes a voice channel by a given name.',
  permission: 'Manage Channels',
  usage: 'deleteVoiceChannel <Channel Name>',
  example: ['deleteVoiceChannel Voice Channel Name']
};
