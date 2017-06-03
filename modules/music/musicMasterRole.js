/**
 * @file musicMasterRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!/^[0-9]{18}$/.test(args[0])) {
    Bastion.db.run(`UPDATE guildSettings SET musicMasterRoleID=null WHERE guildID=${message.guild.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Music Master role has been removed.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    let role = message.guild.roles.get(args[0]);

    if (!role) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No role found for the provided role ID.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    Bastion.db.run(`UPDATE guildSettings SET musicMasterRoleID=${args[0]} WHERE guildID=${message.guild.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `**${role.name}** has been set as the Music Master role.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'musicmaster' ],
  enabled: true
};

exports.help = {
  name: 'musicmasterrole',
  description: 'Adds a role (by ID) as the music master role of Bastion. Users with this role get access to restricted music commands like summon, stop, etc.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'musicMasterRole [ROLE_ID]',
  example: [ 'musicMasterRole 319225727067095043', 'musicMasterRole' ]
};
