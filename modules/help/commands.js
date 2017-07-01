/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const fs = require('fs');
let commands = {};

exports.run = (Bastion, message) => {
  // eslint-disable-next-line no-sync
  let modules = Bastion.functions.getDirSync('./modules/');
  let fields = [];
  for (let i = 0; i < modules.length; i++) {
    commands[modules[i]] = [];
    loadCommands(modules[i]);
    fields.push({
      name: modules[i].toUpperCase(),
      value: Bastion.config.prefix + commands[modules[i]].join(`\n${Bastion.config.prefix}`),
      inline: true
    });
  }

  message.author.send({
    embed: {
      color: Bastion.colors.yellow,
      title: 'List of Commands',
      description: 'To get a complete list of all the commands with details click [here](https://bastion.js.org/commands).',
      fields: fields,
      footer: {
        text: `Prefix: ${Bastion.config.prefix} | Total Commands: ${Bastion.commands.size}`
      }
    }
  }).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        description: `${message.author} Check your DM from me, I've sent you the list of commands.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true
};

exports.help = {
  name: 'commands',
  description: string('commands', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'commands',
  example: []
};

/**
 * Loads the commands
 * @function loadCommands
 * @param {string} module The name of the module.
 * @returns {void}
*/
function loadCommands(module) {
  // TODO: use async method or store modules in Bastion object while booting up.
  // eslint-disable-next-line no-sync
  let files = fs.readdirSync(`./modules/${module}/`);
  files.forEach(f => {
    let cmd = require(`../../modules/${module}/${f}`);
    commands[module].push(cmd.help.name);
  });
}
