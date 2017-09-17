/**
 * @file lockdown command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);

  if (args.remove) {
    await message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    }).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Channel Lockdown Removed',
        description: 'The lockdown on this channel has now been removed, you can now send messages in this channel.',
        footer: {
          text: `Removed by ${message.author.tag}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    await message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    }).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Channel Lockdown Initiated',
        description: 'This text channel is in lockdown. You do not have permissions to send message in this channel unless you are explicitly allowed.\nAdministrators can remove the lockdown using the `lockdown --remove` command.',
        footer: {
          text: `Initiated by ${message.author.tag}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'lockdown',
  botPermission: 'MANAGE_ROLES',
  userPermission: 'ADMINISTRATOR',
  usage: 'lockdown [--remove]',
  example: [ 'lockdown', 'lockdown --remove' ]
};
