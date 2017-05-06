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

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  args = args.join(' ');
  if (!/.+ << .+/.test(args)) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  args = args.split(' << ');
  sql.run('INSERT INTO triggers (trigger, response) VALUES (?, ?)', [args[0], args[1]]).catch(e => {
    Bastion.log.error(e.stack);
  });

  message.channel.send({embed: {
    color: Bastion.colors.green,
    title: 'New Trigger Added',
    fields: [
      {
        name: 'Trigger',
        value: args[0]
      },
      {
        name: 'Response',
        value: args[1]
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['addtrip']
};

exports.help = {
  name: 'addtrigger',
  description: 'Adds a trigger with a response message. Separate trigger & message with `<<`.`',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'addTrigger <trigger> << <response>',
  example: ['addTrigger Hi, there? << Hello $user! :wave:']
};
