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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = function(Bastion, message, args) {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!/^[0-9]{18}$/.test(args[0])) return;
  sql.run(`UPDATE guildSettings SET musicTextChannelID=${message.channel.id}, musicVoiceChannelID=${args[0]} WHERE guildID=${message.guild.id}`).then(() => {
    message.channel.sendMessage('', {embed: {
      color: 5088314,
      title: 'Default music channel set',
      fields: [
        {
          name: 'Text channel for music commands',
          value: `<#${message.channel.id}>`
        },
        {
          name: 'Music channel',
          value: message.guild.channels.filter(c => c.type == 'voice').get(args[0]) ? message.guild.channels.filter(c => c.type == 'voice').get(args[0]).name : 'Invalid'
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['amc']
};

exports.help = {
  name: 'addmusicchannel',
  description: 'Adds a voice (by ID) & text channel (the channel this command was used) specific for the music module. i.e, BOT will only accept music commands in that text channel & if any one summons the bot it will automatically join the specified voice channel.',
  permission: '',
  usage: 'addmusicchannel <voice_channel_id>',
  example: ['addmusicchannel 112233445566778899']
};
