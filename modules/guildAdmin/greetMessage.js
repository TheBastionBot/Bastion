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
  if (!message.guild.members.get(message.author.id).hasPermission("ADMINISTRATOR")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) {
    sql.get(`SELECT greetMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.sendMessage('', {embed: {
        color: 5088314,
        title: 'Greeting message:',
        description: guild.greetMessage
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    sql.run(`UPDATE guildSettings SET greetMessage='${args.join(' ')}' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e.stack);
    });

    message.channel.sendMessage('', {embed: {
      color: 5088314,
      title: 'Greeting message set to:',
      description: args.join(' ')
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['gmsg']
};

exports.help = {
  name: 'greetmessage',
  description: 'Edit the greeting message that shows when a new member is joined in the server.',
  permission: '',
  usage: 'greetMessage [Message]',
  example: ['greetMessage Hello $user! Welcome to $server.']
};
