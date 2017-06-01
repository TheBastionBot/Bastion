/**
 * @file renameRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!args.old || !args.new) {
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

  args.old = args.old.join(' ');
  args.new = args.new.join(' ');

  let role = message.guild.roles.find('name', args.old);
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

  role.setName(args.new).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Role Renamed',
        fields: [
          {
            name: 'From',
            value: args.old,
            inline: true
          },
          {
            name: 'To',
            value: args.new,
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
  enabled: true,
  argsDefinitions: [
    { name: 'old', type: String, alias: 'o', multiple: true },
    { name: 'new', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'renamerole',
  description: 'Renames a given role to a given new name.',
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'renameRole < -o Old Role Name -n New Role Name >',
  example: [ 'renameRole -o Server Staffs -n Legendary Staffs' ]
};
