/**
 * @file deleteRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('MANAGE_ROLES')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (args.length < 1) {
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

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find('name', args.join(' '));
  }
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'No role found with that name.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  role.delete().then(r => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'Role Deleted',
        fields: [
          {
            name: 'Role Name',
            value: r.name,
            inline: true
          },
          {
            name: 'Role ID',
            value: r.id,
            inline: true
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'dr' ],
  enabled: true
};

exports.help = {
  name: 'deleterole',
  description: 'Deletes a role by a given name.',
  botPermission: 'Manage Roles',
  userPermission: 'Manage Roles',
  usage: 'deleteRole <Role Name>',
  example: [ 'deleteRole Role Name' ]
};
