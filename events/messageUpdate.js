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

module.exports = (oldMessage, newMessage) => {
  if (newMessage.content.includes(newMessage.client.token)) {
    if (oldMessage.guild) {
      newMessage.delete().catch(e => {
        newMessage.client.log.error(e.stack);
      });
    }
    newMessage.client.fetchApplication().then(app => {
      newMessage.client.users.get(app.owner.id).send({embed: {
        color: newMessage.client.colors.red,
        title: 'ATTENTION!',
        description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
        fields: [
          {
            name: 'Responsible user',
            value: `${newMessage.author.tag} - ${newMessage.author.id}`
          }
        ]
      }}).catch(e => {
        newMessage.client.log.error(e.stack);
      });
    }).catch(e => {
      newMessage.client.log.error(e.stack);
    });
  }

  if (!oldMessage.guild) return;
  if (newMessage.author.bot) return;

  sql.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${newMessage.guild.id}`).then(guild => {
    if (guild.filterInvite === 'true' && !newMessage.guild.members.get(newMessage.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite\/)\/?([a-z0-9-.]+)?/i.test(newMessage.content)) {
        newMessage.delete().catch(e => {
          newMessage.client.log.error(e.stack);
        });
      }
    }
  }).catch(e => {
    newMessage.client.log.error(e.stack);
  });
};
