/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');
SQL.open('./data/Bastion.sqlite');

module.exports = member => {
  SQL.get(`SELECT farewell, farewellMessage, farewellChannelID, farewellTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.farewell === 'true') {
      let farewellMsg = row.farewellMessage;
      farewellMsg = farewellMsg.replace(/\$user/ig, `<@${member.id}>`);
      farewellMsg = farewellMsg.replace(/\$server/ig, member.guild.name);
      farewellMsg = farewellMsg.replace(/\$username/ig, member.displayName);
      farewellMsg = farewellMsg.replace(/\$prefix/ig, member.client.config.prefix);

      member.guild.channels.get(row.farewellChannelID).send({
        embed: {
          color: member.client.colors.red,
          title: `Goodbye ${member.displayName}!`,
          description: farewellMsg
        }
      }).then(m => {
        if (row.farewellTimeout > 0) {
          m.delete(1000 * parseInt(row.farewellTimeout)).catch(e => {
            member.client.log.error(e.stack);
          });
        }
      }).catch(e => {
        member.client.log.error(e.stack);
      });
    }
  }).catch(e => {
    member.client.log.error(e.stack);
  });

  // Commented this out as using requires BAN_MEMBERS perms and not everyone has given the bot those permissions
  // member.guild.fetchBans().then(users => {
  //   if (users.has(member.id)) return;
  SQL.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    member.guild.channels.get(row.logChannelID).send({
      embed: {
        color: member.client.colors.red,
        title: 'User Left',
        fields: [
          {
            name: 'User',
            value: member.user.tag,
            inline: true
          },
          {
            name: 'User ID',
            value: member.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      member.client.log.error(e.stack);
    });
  }).catch(e => {
    member.client.log.error(e.stack);
  });
  // }).catch(e => {
  //   member.client.log.error(e.stack);
  // });
};
