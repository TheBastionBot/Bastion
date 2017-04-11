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
  if (!message.member.hasPermission("ADMINISTRATOR")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!(index = parseInt(args[0])) || index <= 0) {
    return message.channel.sendMessage('', {embed: {
      color: 15451167,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  index -= 1;

  sql.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row) {
      message.channel.sendMessage('', {embed: {
        color: 13380644,
        description: 'No self assignable roles found.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let roles = JSON.parse(row.selfAssignableRoles);
      if (index >= roles.length) {
        return message.channel.sendMessage('', {embed: {
          color: 13380644,
          description: 'That index was not found.'
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      let deletedRoleID = roles[parseInt(args[0]) - 1];
      roles.splice(parseInt(args[0]) - 1, 1);
      sql.run(`UPDATE guildSettings SET selfAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.sendMessage('', {embed: {
          color: 13380644,
          description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(() => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['rsar']
};

exports.help = {
  name: 'removeselfassignableroles',
  description: 'Deletes a role from the self assignable roles by it\'s index number.',
  permission: '',
  usage: 'removeSelfAssignableRoles <index>',
  example: ['removeSelfAssignableRoles 3']
};
