/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  // Commented this out as using requires BAN_MEMBERS perms and not everyone would've given the bot perms
  // member.guild.fetchBans().then(users => {if (users.has(member.id)) return;}).catch(e => {member.client.log(e);})
  member.client.emit('serverLog', member.client, member.guild, 'guildMemberRemove', {
    member: member
  });

  try {
    let guild = await member.client.db.get(`SELECT farewell, farewellMessage, farewellTimeout FROM guildSettings WHERE guildID=${member.guild.id}`);
    if (!guild) return;

    if (guild.farewell) {
      let farewellMessage = 'May we meet again.';
      if (guild.farewellMessage) {
        farewellMessage = await member.client.decodeString(guild.farewellMessage);
      }
      farewellMessage = farewellMessage.replace(/\$user/ig, `<@${member.id}>`);
      farewellMessage = farewellMessage.replace(/\$server/ig, member.guild.name);
      farewellMessage = farewellMessage.replace(/\$username/ig, member.displayName);
      farewellMessage = farewellMessage.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

      member.guild.channels.get(guild.farewell).send({
        embed: {
          color: member.client.colors.red,
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
