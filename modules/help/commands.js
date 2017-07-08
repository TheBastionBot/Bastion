/**
 * @file commands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  let modules = [ ...new Set(Bastion.commands.map(c => c.config.module)) ];

  let fields = [];
  for (let i = 0; i < modules.length; i++) {
    let commands = Bastion.commands.filter(c => c.config.module === modules[i]).map(c => c.help.name);
    if (commands.length === 0) {
      continue;
    }

    fields.push({
      name: modules[i].replace('_', ' ').toTitleCase(),
      value: Bastion.config.prefix + commands.join(`\n${Bastion.config.prefix}`),
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
        text: `Total Modules: ${modules.length} | Total Commands: ${Bastion.commands.size}`
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
