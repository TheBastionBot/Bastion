/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  let guild = await member.client.db.get(`SELECT farewell, farewellMessage, farewellTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).catch(e => {
    member.client.log.error(e);
  });

  if (guild && guild.farewell) {
    let farewellMsg = guild.farewellMessage;
    farewellMsg = farewellMsg.replace(/\$user/ig, `<@${member.id}>`);
    farewellMsg = farewellMsg.replace(/\$server/ig, member.guild.name);
    farewellMsg = farewellMsg.replace(/\$username/ig, member.displayName);
    farewellMsg = farewellMsg.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

    member.guild.channels.get(guild.farewell).send({
      embed: {
        color: member.client.colors.red,
        title: `Goodbye ${member.displayName}!`,
        description: farewellMsg
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

  // Commented this out as using requires BAN_MEMBERS perms and not everyone would've given the bot perms
  // member.guild.fetchBans().then(users => {
  //   if (users.has(member.id)) return;
  member.client.emit('serverLog', member.client, member.guild, 'guildMemberRemove', {
    member: member
  });
};
