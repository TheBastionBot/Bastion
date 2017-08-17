/**
 * @file renameChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!args.old || !args.new) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let minLength = 2, maxLength = 100;
  args.old = args.old.join(' ');
  args.new = args.new.join(' ');

  if (args.new.length < minLength || args.new.length > maxLength) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('channelNameLength', 'errorMessage', minLength, maxLength), message.channel);
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
    return Bastion.emit('error', string('notFound', 'errors'), string('channelNotFound', 'errorMessage'), message.channel);
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

  try {
    await channel.setName(args.new);
    await message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
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
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
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
