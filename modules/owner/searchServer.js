/**
 * @file searchServer command
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

  let guilds = Bastion.guilds.filter(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())).map(g => g.name);
  let total = guilds.length;
  guilds = total > 0 ? guilds.slice(0, 10).join(', ') : 'None';

  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      title: 'Server search',
      description: `Found **${total}** servers with **${args.join(' ')}** in it's name.`,
      fields: [
        {
          name: 'Servers',
          value: total > 10 ? `and ${total - 10} more.` : guilds
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'servers' ],
  enabled: true
};

exports.help = {
  name: 'searchserver',
  description: string('searchServer', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'searchServer <name>',
  example: [ 'searchServer Bastion' ]
};
