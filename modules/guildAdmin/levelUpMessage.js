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
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0 && !message.guild.members.get(message.author.id).hasPermission("ADMINISTRATOR")) return Bastion.log.info('You don\'t have permissions to use this command.');

  sql.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.levelUpMessage == 'true') {
      sql.run(`UPDATE guildSettings SET levelUpMessage='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      levelUpMessageStats = 'I won\'t any send messages when someone levels up from now on.';
    }
    else {
      sql.run(`UPDATE guildSettings SET levelUpMessage='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      levelUpMessageStats = 'I will now send messages when someone levels up.';
    }

    message.channel.sendMessage('', {embed: {
      color: 5088314,
      description: levelUpMessageStats
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['lvlupmsg']
};

exports.help = {
  name: 'levelupmessage',
  description: 'Toggles sending messages when someone levels up in this server.',
  permission: '',
  usage: 'levelUpMessage',
  example: []
};
