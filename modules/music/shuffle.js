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
  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (!message.guild.voiceConnection) return;
  else if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.guild.voiceConnection.channel.permissionsFor(message.member).has('MUTE_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'shuffle',
  description: 'Shuffles the songs in the current queue.',
  botPermission: '',
  userPermission: 'Mute Members',
  usage: 'shuffle',
  example: []
};
