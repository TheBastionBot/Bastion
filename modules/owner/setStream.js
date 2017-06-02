/**
 * @file setStream command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!/^((https:\/\/)(www\.)?(twitch\.tv)\/[a-z0-9-._]+)$/i.test(args[0]) || args.slice(1).join(' ').length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.user.setGame(args.slice(1).join(' '), args[0]).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username} is now streaming **${args.slice(1).join(' ')}**`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setstream',
  description: 'Set the bot to streaming mode with a given twitch link and name.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setStream <twitch> <text>',
  example: [ 'setStream https://twitch.tv/TheGamerFDN The Gamer Foundation' ]
};
