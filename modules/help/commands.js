/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const fs = require('fs');
const getDirSync = require('../../functions/getDirSync').func;
let commands = new Object();

exports.run = function(Bastion, message, args) {
  let modules = getDirSync('./modules/');
  let fields = [];
  for (var i = 0; i < modules.length; i++) {
    commands[modules[i]] = [];
    loadCommands(modules[i]);
    fields.push({
      name: modules[i].toUpperCase(),
      value: Bastion.config.prefix + commands[modules[i]].join(`\n${Bastion.config.prefix}`),
      inline: true
    });
  }

  message.channel.sendMessage('', {embed: {
    color: 15451167,
    title: 'List of Commands',
    description: `To get help/details about a command, type \`${Bastion.config.prefix}help command_name\`\nTo get a complete list of all the commands with details click [here](https://bastion.js.org/commands).`,
    fields: fields,
    footer: {
      text: `Prefix: ${Bastion.config.prefix} | Total Commands: ${Bastion.commands.size}`
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['cmds']
};

exports.help = {
  name: 'commands',
  description: 'Shows the complete list of commands with their aliases.',
  permission: '',
  usage: ['commands']
};

function loadCommands(module) {
  files = fs.readdirSync(`./modules/${module}/`);
  files.forEach(f => {
    let cmd = require(`../../modules/${module}/${f}`);
    commands[module].push(cmd.help.name);
  });
}
