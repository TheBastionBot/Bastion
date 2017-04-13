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
  if (!message.member.hasPermission("ADMINISTRATOR")) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) {
    sql.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.sendMessage('', {embed: {
        color: Bastion.colors.dark_grey,
        title: 'Farewell message:',
        description: guild.farewellMessage
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    sql.run(`UPDATE guildSettings SET farewellMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e.stack);
    });

    message.channel.sendMessage('', {embed: {
      color: Bastion.colors.green,
      title: 'Farewell message set to:',
      description: args.join(' ')
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['fmsg']
};

exports.help = {
  name: 'farewellmessage',
  description: 'Edit the farewell message that shows when a member leaves the server.',
  permission: '',
  usage: 'farewellMessage [Message]',
  example: ['farewellMessage Goodbye $username. Hope to see you soon!']
};
