/**
 * @file renameRole command
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

  if (args.length < 3) {
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
  args = args.join(' ').split(' - ');
  let oldName = args[0];
  let newName = args[1];
  let role = message.guild.roles.find('name', oldName);
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

  role.setName(newName).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Role Renamed',
        fields: [
          {
            name: 'From',
            value: oldName,
            inline: true
          },
          {
            name: 'To',
            value: newName,
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
  aliases: [ 'renr' ],
  enabled: true
};

exports.help = {
  name: 'renamerole',
  description: 'Renames a given role to a given new name.',
  botPermission: 'Manage Roles',
  userPermission: 'Manage Roles',
  usage: 'renameRole <Old Role Name> - <New Role Name>',
  example: [ 'renameRole Old Role Name - New Role Name' ]
};
