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

// I don't understand why this is even needed, but some fellows like this.
const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.get(`SELECT farewell, farewellChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (row.farewellChannelID === message.channel.id) {
      sql.run(`UPDATE guildSettings SET farewell='false', farewellChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      farewellStats = 'Farewell Messages are now disabled.';
    }
    else {
      sql.run(`UPDATE guildSettings SET farewell='true', farewellChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      farewellStats = 'Farewell Messages are now enabled in this channel.';
    }

    message.channel.send({embed: {
      color: color,
      description: farewellStats
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'farewell',
  description: 'Toggle farewell message for members who left the server.',
  botPermission: '',
  userPermission: 'Administrator',
  usage: 'farewell',
  example: []
};
