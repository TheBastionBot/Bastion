/**
 * @file guildMemberRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async member => {
  try {
    let guildModel = await member.client.database.models.guild.findOne({
      attributes: [ 'farewell', 'farewellMessage', 'farewellTimeout', 'serverLog' ],
      where: {
        guildID: member.guild.id
      }
    });
    if (!guildModel) return;

    if (guildModel.dataValues.farewell) {
      let farewellMessage = 'May we meet again.';
      if (guildModel.dataValues.farewellMessage) {
        farewellMessage = await member.client.methods.decodeString(guildModel.dataValues.farewellMessage);
      }
      farewellMessage = farewellMessage.replace(/\$user/ig, `<@${member.id}>`);
      farewellMessage = farewellMessage.replace(/\$server/ig, member.guild.name);
      farewellMessage = farewellMessage.replace(/\$username/ig, member.displayName);
      farewellMessage = farewellMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      let farewellChannel = member.guild.channels.get(guildModel.dataValues.farewell);
      if (farewellChannel) {
        farewellChannel.send({
          embed: {
            color: member.client.colors.BLUE,
            title: `Goodbye ${member.displayName}!`,
            description: farewellMessage
          }
        }).then(m => {
          if (guildModel.dataValues.farewellTimeout > 0) {
            m.delete(1000 * parseInt(guildModel.dataValues.farewellTimeout)).catch(e => {
              member.client.log.error(e);
            });
          }
        }).catch(e => {
          member.client.log.error(e);
        });
      }
    }

    if (guildModel.dataValues.serverLog) {
      if (member.guild.me && member.guild.me.hasPermission('BAN_MEMBERS')) {
        let bannedUsers = await member.guild.fetchBans();
        if (bannedUsers.has(member.id)) return;
      }

      let logChannel = member.guild.channels.get(guildModel.dataValues.serverLog);
      if (logChannel) {
        logChannel.send({
          embed: {
            color: member.guild.client.colors.RED,
            title: member.guild.client.i18n.event(member.guild.language, 'guildMemberRemove'),
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
  }
  catch (e) {
    member.client.log.error(e);
  }
};
