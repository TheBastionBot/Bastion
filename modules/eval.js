/**
 * @file eval command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.code) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.code = args.code.join(' ');

    let evaled;
    if (args.broadcast && Bastion.shard) {
      evaled = await Bastion.shard.broadcastEval(args.code);
    }
    else {
      evaled = eval(args.code);
    }

    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled);
    }

    let output = await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        fields: [
          {
            name: ':inbox_tray:  INPUT',
            value: `\`\`\`js\n${args.code}\n\`\`\``
          },
          {
            name: ':outbox_tray:  OUTPUT',
            value: `\`\`\`js\n${clean(Bastion, evaled)}\n\`\`\``
          }
        ]
      }
    });

    if (args.delete) {
      output.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
  catch(e) {
    let error = await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        fields: [
          {
            name: ':no_entry:  ERROR',
            value: `\`\`\`js\n${clean(Bastion, e)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    if (args.delete) {
      error.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'code', type: String, multiple: true, defaultOption: true },
    { name: 'broadcast', type: Boolean },
    { name: 'delete', type: Boolean }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'eval',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'eval <JavaScript code> [--delete]',
  example: [ 'eval message.guild.members.size', 'eval Bastion.users.size --delete' ]
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
