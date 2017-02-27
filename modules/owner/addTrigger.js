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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = function(Bastion, message, args) {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');

  args = args.join(' ')
  if (!/.+ << .+/.test(args)) return;
  args = args.split(' << ');
  sql.run('INSERT INTO triggers (trigger, response) VALUES (?, ?)', [args[0], args[1]]);

  message.channel.sendMessage('', {embed: {
    color: 5088314,
    title: 'New Trigger Added',
    fields: [
      {
        name: 'Trigger',
        value: args[0]
      },
      {
        name: 'Message',
        value: args[1]
      }
    ]
  }});
};

exports.conf = {
  aliases: ['addtrip']
};

exports.help = {
  name: 'addtrigger',
  description: 'Adds a trigger with a response message. Separate trigger & message with `<<`.`',
  permission: '',
  usage: ['addTrigger Hi, there? << Hello $user! :wave:']
};
