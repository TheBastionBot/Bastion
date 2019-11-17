/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async member => {
  try {
    const greetMessages = xrequire('./assets/greetingMessages.json');

    let guildModel = await member.client.database.models.guild.findOne({
      attributes: [ 'greet', 'greetMessage', 'greetTimeout', 'greetPrivate', 'greetPrivateMessage', 'autoAssignableRoles', 'botRole', 'serverLog' ],
      where: {
        guildID: member.guild.id
      }
    });
    if (!guildModel) return;

    if (guildModel.dataValues.serverLog) {
      let logChannel = member.guild.channels.get(guildModel.dataValues.serverLog);
      if (logChannel) {
        logChannel.send({
          embed: {
            color: member.guild.client.colors.GREEN,
            title: member.guild.client.i18n.event(member.guild.language, 'guildMemberAdd'),
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

    if (guildModel.dataValues.greet) {
      let greetMessage = guildModel.dataValues.greetMessage && Object.keys(guildModel.dataValues.greetMessage).length ? guildModel.dataValues.greetMessage : { text: greetMessages.getRandom() };

      greetMessage = JSON.stringify(greetMessage);

      greetMessage = member.client.methods.replaceMemberVariables(greetMessage, member);

      let text, embed;
      greetMessage = JSON.parse(greetMessage);

      text = greetMessage.text ? greetMessage.text : null;
      delete greetMessage.text;
      embed = Object.keys(greetMessage).length ? greetMessage : null;

      if (embed) {
        embed.footer = {};
        embed.footer.text = 'Greetings!';
      }

      let greetChannel = member.guild.channels.get(guildModel.dataValues.greet);

      if (greetChannel) {
        let greetings;

        if (text && embed) {
          greetings = await greetChannel.send(text, { embed: embed }).catch(e => {
            member.client.log.error(e);
          });
        }
        else if (text) {
          greetings = await greetChannel.send({
            embed: {
              color: member.client.colors.BLUE,
              description: text,
              footer: {
                text: 'Greetings!'
              }
            }
          }).catch(e => {
            member.client.log.error(e);
          });
        }
        else if (embed) {
          greetings = await greetChannel.send({ embed: embed }).catch(e => {
            member.client.log.error(e);
          });
        }

        if (greetings && guildModel.dataValues.greetTimeout > 0) {
          greetings.delete(1000 * parseInt(guildModel.dataValues.greetTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }
    }

    if (guildModel.dataValues.greetPrivate) {
      let greetPrivateMessage = guildModel.dataValues.greetPrivateMessage && Object.keys(guildModel.dataValues.greetPrivateMessage).length ? guildModel.dataValues.greetPrivateMessage : { text: greetMessages.getRandom() };

      greetPrivateMessage = JSON.stringify(greetPrivateMessage);

      greetPrivateMessage = member.client.methods.replaceMemberVariables(greetPrivateMessage, member);

      let text, embed;
      greetPrivateMessage = JSON.parse(greetPrivateMessage);

      text = greetPrivateMessage.text ? greetPrivateMessage.text : null;
      delete greetPrivateMessage.text;
      embed = Object.keys(greetPrivateMessage).length ? greetPrivateMessage : null;

      if (embed) {
        embed.footer = {};
        embed.footer.text = 'Greetings!';
      }


      if (text && embed) {
        await member.send(text, { embed: embed }).catch(e => {
          member.client.log.error(e);
        });
      }
      else if (text) {
        await member.send({
          embed: {
            color: member.client.colors.BLUE,
            description: text,
            footer: {
              text: 'Greetings!'
            }
          }
        }).catch(e => {
          member.client.log.error(e);
        });
      }
      else if (embed) {
        await member.send({ embed: embed }).catch(e => {
          member.client.log.error(e);
        });
      }
    }

    let autoAssignableRoles = [];
    if (guildModel.dataValues.autoAssignableRoles) {
      autoAssignableRoles = guildModel.dataValues.autoAssignableRoles;
    }
    autoAssignableRoles = autoAssignableRoles.filter(r => member.guild.roles.get(r));
    if (autoAssignableRoles.length) {
      member.addRoles(autoAssignableRoles).catch(() => {});
    }

    // Bot Role
    if (guildModel.dataValues.botRole && member.user.bot) {
      member.addRole(guildModel.dataValues.botRole).catch(() => {});
    }
  }
  catch (e) {
    member.client.log.error(e);
  }
};
