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

exports.run = function(Bastion, message, args) {
  message.channel.sendMessage('', {embed: {
    color: 15451167,
    title: 'List of Commands',
    description: Array.from(Bastion.commands.keys()).join(', '),
    fields: [
      {
        name: 'Help',
        value: `To get help/details about a command, type \`${Bastion.config.prefix}help command_name\``,
        inline: true
      }
    ],
    footer: {
      text: `Prefix: ${Bastion.config.prefix} | Total Commands: ${Bastion.commands.size}`
    }
  }});
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
