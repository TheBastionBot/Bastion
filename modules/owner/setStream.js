/**
 * @file setStream command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  if (!/^((https:\/\/)(www\.)?(twitch\.tv)\/[a-z0-9-._]+)$/i.test(args[0]) || args.slice(1).join(' ').length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    await Bastion.user.setPresence({
      game: {
        name: args.slice(1).join(' '),
        type: 1,
        url: args[0]
      }
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${Bastion.user.username} is now streaming **${args.slice(1).join(' ')}**`
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
  enabled: true
};

exports.help = {
  name: 'setStream',
  botPermission: '',
  userTextPermission: 'BOT_OWNER',
  usage: 'setStream <twitch> <Status text>',
  example: [ 'setStream https://twitch.tv/k3rn31p4nic Nothing' ]
};
