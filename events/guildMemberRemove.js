/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  // Commented this out as using requires BAN_MEMBERS perms and not everyone would've given the bot perms
  // member.guild.fetchBans().then(users => {if (users.has(member.id)) return;}).catch(e => {member.client.log(e);})

  try {
    let guild = await member.client.db.get(`SELECT farewell, farewellMessage, farewellTimeout, log FROM guildSettings WHERE guildID=${member.guild.id}`);
    if (!guild) return;

    if (guild.log) {
      let logChannel = member.guild.channels.get(guild.log);
      if (logChannel) {
        logChannel.send({
          embed: {
            color: member.guild.client.colors.RED,
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
          member.guild.client.log.error(e);
        });
      }
    }

    if (guild.farewell) {
      let farewellMessage = 'May we meet again.';
      if (guild.farewellMessage) {
        farewellMessage = await member.client.functions.decodeString(guild.farewellMessage);
      }
      farewellMessage = farewellMessage.replace(/\$user/ig, `<@${member.id}>`);
      farewellMessage = farewellMessage.replace(/\$server/ig, member.guild.name);
      farewellMessage = farewellMessage.replace(/\$username/ig, member.displayName);
      farewellMessage = farewellMessage.replace(/\$prefix/ig, member.guild.prefix[0] || member.client.config.prefix);

      member.guild.channels.get(guild.farewell).send({
        embed: {
          color: member.client.colors.BLUE,
          title: `Goodbye ${member.displayName}!`,
          description: farewellMessage
        }
      }).then(m => {
        if (guild.farewellTimeout > 0) {
          m.delete(1000 * parseInt(guild.farewellTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }).catch(e => {
        member.client.log.error(e);
      });
    }
  }
  catch (e) {
    member.client.log.error(e);
  }
};
