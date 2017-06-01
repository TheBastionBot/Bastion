/**
 * @file removeSelfAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  index -= 1;

  sql.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.selfAssignableRoles === '[]') {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No self assignable roles found.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let roles = JSON.parse(row.selfAssignableRoles);
      if (index >= roles.length) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: 'That index was not found.'
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      let deletedRoleID = roles[parseInt(args[0]) - 1];
      roles.splice(parseInt(args[0]) - 1, 1);
      sql.run(`UPDATE guildSettings SET selfAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'rsar' ],
  enabled: true
};

exports.help = {
  name: 'removeselfassignableroles',
  description: 'Deletes a role from the self assignable roles by it\'s index number.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeSelfAssignableRoles <index>',
  example: [ 'removeSelfAssignableRoles 3' ]
};
