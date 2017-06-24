/**
 * @file renameChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {

  if (!args.old || !args.new) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.old = args.old.join(' ');
  args.new = args.new.join(' ');

  if (args.new.length < 2 || args.new.length > 100) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Invalid Data', 'Channel name must be between 2 and 100 characters.', message.channel);
  }

  let channel = message.channel;
  if (args.voice) {
    channel = message.guild.channels.filter(c => c.type === 'voice').find('name', args.old);
  }
  else {
    args.old = args.old.replace(' ', '-');
    args.new = args.new.replace(' ', '-');
    channel = message.guild.channels.filter(c => c.type === 'text').find('name', args.old);
  }

  if (!channel) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Not Found', 'No channel was found for the given parameter.', message.channel);
  }

  if (!channel.permissionsFor(message.member).has(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  channel.setName(args.new).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: `${channel.type.charAt(0).toUpperCase() + channel.type.substr(1)} Channel Renamed`,
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
  aliases: [ 'renamec' ],
  enabled: true,
  argsDefinitions: [
    { name: 'text', type: Boolean, alias: 't' },
    { name: 'voice', type: Boolean, alias: 'v' },
    { name: 'old', type: String, alias: 'o', multiple: true },
    { name: 'new', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'renamechannel',
  description: string('renameChannel', 'commandDescription'),
  botPermission: 'MANAGE_CHANNELS',
  userPermission: 'MANAGE_CHANNELS',
  usage: 'renameChannel [ -t | -v ] < -o Old Channel Name -n New Channel Name>',
  example: [ 'renameChannel -t -o bot-commands -n Songs Deck', 'renameChannel -v -o Music Zone -n Songs Deck' ]
};
