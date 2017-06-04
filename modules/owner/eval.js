/**
 * @file eval command
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

  if (args.length) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    let evaled = eval(args.join(' '));
    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled);
    }
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        fields: [
          {
            name: ':inbox_tray:  INPUT',
            value: `\`\`\`js\n${args.join(' ')}\n\`\`\``
          },
          {
            name: ':outbox_tray:  OUTPUT',
            value: `\`\`\`js\n${clean(Bastion, evaled)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  catch(e) {
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        fields: [
          {
            name: ':no_entry:  ERROR',
            value: `\`\`\`js\n${clean(Bastion, e)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'eval',
  description: 'Evaluates any JavaScript statement.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'eval <JavaScript code>',
  example: [ 'eval message.guild.members.size' ]
};

/**
 * Cleans the evaled result from tokens, etc.
 * @function clean
 * @param {object} Bastion The Bastion object.
 * @param {string} text The evaled result/error before cleaning.
 * @returns {string} The evaled result/error after cleaning.
 */
function clean(Bastion, text) {
  text = text.toString();
  if (text.includes(Bastion.token)) {
    text = text.replace(Bastion.token, 'Not for your evil :eyes:!');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}
