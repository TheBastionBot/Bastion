/**
 * @file listAutoAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  Bastion.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.autoAssignableRoles === '[]') {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No auto assignable roles found.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    let roles = JSON.parse(row.autoAssignableRoles);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];
    // roles = roles.unique(roles);
    let roleNames = [];
    for (let i = 0; i < roles.length; i++) {
      roleNames.push(message.guild.roles.get(roles[i]).name);
    }
    roleNames = roleNames.map((r, i) => `${i + 1}. ${r}`);
    let i = 0;
    if (isNaN(args = parseInt(args[0]))) {
      i = 1;
    }
    else {
      i = (args > 0 && args < roleNames.length / 10 + 1) ? args : 1;
    }
    i = i - 1;
    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        title: 'Auto assignable roles:',
        description: roleNames.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${parseInt(roleNames.length / 10)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'laar' ],
  enabled: true
};

exports.help = {
  name: 'listautoassignableroles',
  description: 'Lists all auto assignable roles.',
  botPermission: '',
  userPermission: '',
  usage: 'listAutoAssignableRoles [page_no]',
  example: [ 'listAutoAssignableRoles', 'listAutoAssignableRoles 2' ]
};
