/**
 * @file ignoreChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    let guildSettings = await Bastion.db.get(`SELECT ignoredChannels FROM guildSettings WHERE guildID=${message.guild.id}`);
    let ignoredChannels = guildSettings.ignoredChannels, isIgnored = false,
      description = null, color = Bastion.colors.red;

    if (ignoredChannels) {
      ignoredChannels = ignoredChannels.split(' ');
      if (ignoredChannels.includes(message.channel.id)) {
        isIgnored = true;
      }
    }
    else {
      ignoredChannels = [];
    }

    if (isIgnored) {
      if (args.remove) {
        ignoredChannels.splice(ignoredChannels.indexOf(message.channel.id), 1);
        color = Bastion.colors.green;
        description = 'I\'ll stop ignoring commands in this channel, from now.';
      }
      else {
        description = 'I\'m already ignoring commands in this channel.';
      }
    }
    else {
      if (args.remove) {
        description = 'I\'m already accepting commands in this channel.';
      }
      else {
        ignoredChannels.push(message.channel.id);
        color = Bastion.colors.green;
        description = 'I\'ll ignore commands in this channel, from now.';
      }
    }
    ignoredChannels = ignoredChannels.join(' ');

    await Bastion.db.run(`UPDATE guildSettings SET ignoredChannels='${ignoredChannels}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: color,
        description: description
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
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
  name: 'ignoreChannel',
  description: string('ignoreChannel', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'ignoreChannel [--remove]',
  example: [ 'ignoreChannel', 'ignoreChannel --remove' ]
};
