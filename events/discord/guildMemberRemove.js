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
      let isEmbed = guildModel.dataValues.farewellMessage && Object.keys(guildModel.dataValues.farewellMessage).length;

      let farewellMessage = isEmbed ? guildModel.dataValues.farewellMessage : 'May we meet again.';

      if (isEmbed) {
        farewellMessage = JSON.stringify(farewellMessage);
      }

      farewellMessage = farewellMessage.replace(/\$user/ig, `<@${member.id}>`);
      farewellMessage = farewellMessage.replace(/\$server/ig, member.guild.name);
      farewellMessage = farewellMessage.replace(/\$username/ig, member.displayName);
      farewellMessage = farewellMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      let text, embed;
      if (isEmbed) {
        farewellMessage = JSON.parse(farewellMessage);

        farewellMessage.footer = {};
        farewellMessage.footer.text = 'Farewell!';

        text = farewellMessage.text ? farewellMessage.text : null;
        delete farewellMessage.text;
        embed = Object.keys(farewellMessage).length ? farewellMessage : null;
      }

      let farewellChannel = member.guild.channels.get(guildModel.dataValues.farewell);

      if (farewellChannel) {
        let farewell;

        if (text && embed) {
          farewell = await farewellChannel.send(text, { embed: embed }).catch(e => {
            member.client.log.error(e);
          });
        }
        else if (text) {
          farewell = await farewellChannel.send({
            embed: {
              color: member.client.colors.RED,
              description: text,
              footer: {
                text: 'Farewell!'
              }
            }
          }).catch(e => {
            member.client.log.error(e);
          });
        }
        else if (embed) {
          farewell = await farewellChannel.send({ embed: embed }).catch(e => {
            member.client.log.error(e);
          });
        }

        if (farewell && guildModel.dataValues.farewellTimeout > 0) {
          await farewell.delete(1000 * parseInt(guildModel.dataValues.farewellTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
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
