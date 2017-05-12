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
  let streamers = Array.from(message.guild.presences.filter(p => p.game && p.game.streaming === true).keys());
  message.channel.send({embed: {
    color: Bastion.colors.violet,
    title: 'Users Streaming',
    description: streamers.length > 10 ? `<@${streamers.splice(0, 10).join('>\n<@')}>` + `\nand ${streamers.length - 10} others are now live.` : `<@${streamers.join('>\n<@')}>`
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'live',
  description: 'Shows the list of users in the server who are currently streaming.',
  botPermission: '',
  userPermission: '',
  usage: 'live',
  example: []
};
