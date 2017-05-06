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
  if (!(index = parseInt(args[0])) || index <= 0) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  index -= 1;

  sql.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.selfAssignableRoles === '[]') {
      message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'No self assignable roles found.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let roles = JSON.parse(row.selfAssignableRoles);
      if (index >= roles.length) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: 'That index was not found.'
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      let deletedRoleID = roles[parseInt(args[0]) - 1];
      roles.splice(parseInt(args[0]) - 1, 1);
      sql.run(`UPDATE guildSettings SET selfAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.send({embed: {
          color: Bastion.colors.red,
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
  aliases: ['rsar'],
  enabled: true
};

exports.help = {
  name: 'removeselfassignableroles',
  description: 'Deletes a role from the self assignable roles by it\'s index number.',
  botPermission: '',
  userPermission: 'Administrator',
  usage: 'removeSelfAssignableRoles <index>',
  example: ['removeSelfAssignableRoles 3']
};
