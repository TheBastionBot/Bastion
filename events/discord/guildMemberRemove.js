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
      let farewellMessage = guildModel.dataValues.farewellMessage && Object.keys(guildModel.dataValues.farewellMessage).length ? guildModel.dataValues.farewellMessage : { text: 'May we meet again.' };

      farewellMessage = JSON.stringify(farewellMessage);

      farewellMessage = member.client.methods.replaceMemberVariables(farewellMessage, member);

      let text, embed;
      farewellMessage = JSON.parse(farewellMessage);

      text = farewellMessage.text ? farewellMessage.text : null;
      delete farewellMessage.text;
      embed = Object.keys(farewellMessage).length ? farewellMessage : null;

      if (embed) {
        embed.footer = {};
        embed.footer.text = 'Farewell!';
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
        let bannedMember = await member.guild.fetchBan(member);
        if (bannedMember) return;
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
