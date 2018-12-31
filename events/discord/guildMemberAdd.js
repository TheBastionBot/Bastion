/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async member => {
  try {
    const greetMessages = xrequire('./assets/greetingMessages.json');

    let guildModel = await member.client.database.models.guild.findOne({
      attributes: [ 'greet', 'greetMessage', 'greetTimeout', 'greetPrivate', 'greetPrivateMessage', 'autoAssignableRoles', 'serverLog' ],
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
      let isEmbed = guildModel.dataValues.greetMessage && Object.keys(guildModel.dataValues.greetMessage).length;

      let greetMessage = isEmbed ? guildModel.dataValues.greetMessage : greetMessages.getRandom();

      if (isEmbed) {
        greetMessage = JSON.stringify(greetMessage);
      }

      greetMessage = greetMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetMessage = greetMessage.replace(/\$server/ig, member.guild.name);
      greetMessage = greetMessage.replace(/\$username/ig, member.displayName);
      greetMessage = greetMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      let text, embed;
      if (isEmbed) {
        greetMessage = JSON.parse(greetMessage);

        greetMessage.footer = {};
        greetMessage.footer.text = 'Greetings!';

        text = greetMessage.text ? greetMessage.text : null;
        delete greetMessage.text;
        embed = Object.keys(greetMessage).length ? greetMessage : null;
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
          await greetings.delete(1000 * parseInt(guildModel.dataValues.greetTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }
    }

    if (guildModel.dataValues.greetPrivate) {
      let isEmbed = guildModel.dataValues.greetPrivateMessage && Object.keys(guildModel.dataValues.greetPrivateMessage).length;

      let greetPrivateMessage = isEmbed ? guildModel.dataValues.greetPrivateMessage : greetMessages.getRandom();

      if (isEmbed) {
        greetPrivateMessage = JSON.stringify(greetPrivateMessage);
      }

      greetPrivateMessage = greetPrivateMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetPrivateMessage = greetPrivateMessage.replace(/\$server/ig, member.guild.name);
      greetPrivateMessage = greetPrivateMessage.replace(/\$username/ig, member.displayName);
      greetPrivateMessage = greetPrivateMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      let text, embed;
      if (isEmbed) {
        greetPrivateMessage = JSON.parse(greetPrivateMessage);

        greetPrivateMessage.footer = {};
        greetPrivateMessage.footer.text = 'Greetings!';

        text = greetPrivateMessage.text ? greetPrivateMessage.text : null;
        delete greetPrivateMessage.text;
        embed = Object.keys(greetPrivateMessage).length ? greetPrivateMessage : null;
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
  }
  catch (e) {
    member.client.log.error(e);
  }
};
