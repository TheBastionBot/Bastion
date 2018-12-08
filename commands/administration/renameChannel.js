/**
 * @file renameChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.old || !args.new) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let minLength = 2, maxLength = 100;
  args.old = args.old.join(' ');
  args.new = args.new.join(' ');

  if (!args.new.length.inRange(minLength, maxLength)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'channelNameLength', minLength, maxLength), message.channel);
  }

  let channel = message.channel;
  if (args.voice) {
    channel = message.guild.channels.filter(c => c.type === 'voice').find(channel => channel.name === args.old);
  }
  else {
    args.old = args.old.replace(' ', '-');
    args.new = args.new.replace(' ', '-');
    channel = message.guild.channels.filter(c => c.type === 'text').find(channel => channel.name === args.old);
  }

  if (!channel) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'channelNotFound'), message.channel);
  }

  if (!channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  await channel.setName(args.new);
  await message.channel.send({
    embed: {
      color: Bastion.colors.ORANGE,
      description: Bastion.i18n.info(message.guild.language, 'renameChannel', message.author.tag, channel.type, args.old, args.new),
      footer: {
        text: `ID: ${channel.id}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
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
  name: 'renameChannel',
  description: 'Renames the specified text or voice channel of your Discord server.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'renameChannel [ -t | -v ] < -o Old Channel Name -n New Channel Name>',
  example: [ 'renameChannel -t -o bot-commands -n Songs Deck', 'renameChannel -v -o Music Zone -n Songs Deck' ]
};
