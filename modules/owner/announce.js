/**
 * @file announce command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  for (let i = 0; i < Bastion.guilds.size; i++) {
    Bastion.guilds.map(g => g.defaultChannel)[i].send({
      embed: {
        color: Bastion.colors.blue,
        description: args.join(' ')
      }
    }).catch(() => {});
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'Announced',
      description: args.join(' ')
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'notify' ],
  enabled: true
};

exports.help = {
  name: 'announce',
  description: string('announce', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
