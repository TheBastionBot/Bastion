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

module.exports = member => {
  sql.get(`SELECT farewell, farewellMessage, farewellChannelID, farewellTimeout FROM guildSettings WHERE guildID ='${member.guild.id}'`).then(row => {
    if (row.farewell == 'true') {
      let farewellMsg = row.farewellMessage;
      farewellMsg = farewellMsg.replace(/\$user/, `<@${member.id}>`);
      farewellMsg = farewellMsg.replace(/\$server/, member.guild.name);
      farewellMsg = farewellMsg.replace(/\$username/, member.displayName);

      member.guild.channels.get(row.farewellChannelID).sendMessage('', {embed: {
        color: 13380644,
        title: `Goodbye ${member.displayName}!`,
        description: farewellMsg + '\n:wave:'
      }}).then(m => {
        if (farewellTimeout > 0) m.delete(1000*parseInt(farewellTimeout));
      });
    }
  });

  sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID ='${member.guild.id}'`).then(row => {
    if (row.log == 'false') return;
    member.guild.channels.get(row.logChannelID).sendMessage('', {embed: {
      color: 13380644,
      title: 'User Left',
      fields: [
        {
          name: 'Username',
          value: `**${member.user.username}**#${member.user.discriminator}`,
          inline: true
        },
        {
          name: 'ID',
          value: member.id,
          inline: true
        },
        {
          name: 'Left At',
          value: new Date().toUTCString(),
          inline: false
        }
      ]
    }});
  });
};
