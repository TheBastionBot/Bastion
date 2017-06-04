/**
 * @file inRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find('name', args.join(' '));
  }

  if (role) {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: `Members in ${role.name} role:\n`,
        description: role.members.size > 10 ? `${role.members.map(m => m.user.tag).splice(0, 10).join('\n')}\nand ${role.members.size - 10} members.` :  role.members.map(m => m.user.tag).join('\n'),
        thumbnail: {
          url: `https://dummyimage.com/250/${role.hexColor.slice(1)}/&text=%20`
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'The specified role was not found.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'inrole',
  description: 'Shows the list of all the users in a specified role.',
  botPermission: '',
  userPermission: '',
  usage: 'inRole <Role Name|@role-mention>',
  example: [ 'inRole Role Name', 'inrole @roleMention' ]
};
