/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = member => {
  member.client.db.get(`SELECT farewell, farewellMessage, farewellChannelID, farewellTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.farewell === 'true') {
      let farewellMsg = row.farewellMessage;
      farewellMsg = farewellMsg.replace(/\$user/ig, `<@${member.id}>`);
      farewellMsg = farewellMsg.replace(/\$server/ig, member.guild.name);
      farewellMsg = farewellMsg.replace(/\$username/ig, member.displayName);
      farewellMsg = farewellMsg.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

      member.guild.channels.get(row.farewellChannelID).send({
        embed: {
          color: member.client.colors.red,
          title: `Goodbye ${member.displayName}!`,
          description: farewellMsg
        }
      }).then(m => {
        if (row.farewellTimeout > 0) {
          m.delete(1000 * parseInt(row.farewellTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }).catch(e => {
        member.client.log.error(e);
      });
    }
  }).catch(e => {
    member.client.log.error(e);
  });

  // Commented this out as using requires BAN_MEMBERS perms and not everyone would've given the bot perms
  // member.guild.fetchBans().then(users => {
  //   if (users.has(member.id)) return;
  member.client.emit('serverLog', member.client, member.guild, 'guildMemberRemove', {
    member: member
  });
};
