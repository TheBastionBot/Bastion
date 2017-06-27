/**
 * @file roleInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

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
        title: 'Role info',
        fields: [
          {
            name: 'Name',
            value: role.name,
            inline: true
          },
          {
            name: 'ID',
            value: role.id,
            inline: true
          },
          {
            name: 'Hoisted',
            value: role.hoist ? 'Yes' : 'No',
            inline: true
          },
          {
            name: 'External',
            value: role.managed ? 'Yes' : 'No',
            inline: true
          },
          {
            name: 'Created At',
            value: role.createdAt.toUTCString(),
            inline: true
          },
          {
            name: 'Users',
            value: role.members.size,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://dummyimage.com/250/${role.hexColor.slice(1)}/&text=%20`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), 'No role was found for the given parameter.', message.channel);
  }
};

exports.config = {
  aliases: [ 'rinfo' ],
  enabled: true
};

exports.help = {
  name: 'roleinfo',
  description: string('roleInfo', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'roleInfo <@role-mention|role_name>',
  example: [ 'roleInfo @Dark Knigths', 'roleInfo The Legends' ]
};
