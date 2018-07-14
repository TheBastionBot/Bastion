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
      let greetMessage;
      if (guildModel.dataValues.greetMessage) {
        greetMessage = await member.client.methods.decodeString(guildModel.dataValues.greetMessage);
      }
      else {
        greetMessage = greetMessages[Math.floor(Math.random() * greetMessages.length)];
      }
      greetMessage = greetMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetMessage = greetMessage.replace(/\$server/ig, member.guild.name);
      greetMessage = greetMessage.replace(/\$username/ig, member.displayName);
      greetMessage = greetMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      let greetChannel = member.guild.channels.get(guildModel.dataValues.greet);
      if (greetChannel) {
        greetChannel.send({
          embed: {
            color: member.client.colors.BLUE,
            title: `Hello ${member.displayName}`,
            description: greetMessage
          }
        }).then(m => {
          if (guildModel.dataValues.greetTimeout > 0) {
            m.delete(1000 * parseInt(guildModel.dataValues.greetTimeout)).catch(e => {
              member.client.log.error(e);
            });
          }
        }).catch(e => {
          member.client.log.error(e);
        });
      }
    }

    if (guildModel.dataValues.greetPrivate) {
      let greetPrivateMessage;
      if (guildModel.dataValues.greetPrivateMessage) {
        greetPrivateMessage = await member.client.methods.decodeString(guildModel.dataValues.greetPrivateMessage);
      }
      else {
        greetPrivateMessage = greetMessages[Math.floor(Math.random() * greetMessages.length)];
      }
      greetPrivateMessage = greetPrivateMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetPrivateMessage = greetPrivateMessage.replace(/\$server/ig, member.guild.name);
      greetPrivateMessage = greetPrivateMessage.replace(/\$username/ig, member.displayName);
      greetPrivateMessage = greetPrivateMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0]);

      member.send({
        embed: {
          color: member.client.colors.BLUE,
          title: `Hello ${member.displayName}`,
          description: greetPrivateMessage
        }
      }).catch(e => {
        member.client.log.error(e);
      });
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
