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

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (row.filterInvite === 'false') {
      sql.run(`UPDATE guildSettings SET filterInvite='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      filterInviteStats = 'Enabled automatic deletion of discord server invites posted in this server.';
    }
    else {
      sql.run(`UPDATE guildSettings SET filterInvite='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      filterInviteStats = 'Disabled automatic deletion of discord server invites posted in this server.';
    }

    message.channel.send({embed: {
      color: color,
      description: filterInviteStats
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['filterinv']
};

exports.help = {
  name: 'filterinvite',
  description: 'Toggles automatic deleting of discord server invites posted in the server. Does not apply to the server Administrators.',
  botPermission: 'Manage Messages',
  permission: 'Administrator',
  usage: 'filterInvite',
  example: []
};
