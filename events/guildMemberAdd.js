/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  try {
    const greetMessages = require('../data/greetingMessages.json');
    let guild = await member.client.db.get(`SELECT greet, greetMessage, greetTimeout, greetPrivate, greetPrivateMessage, autoAssignableRoles, log FROM guildSettings WHERE guildID=${member.guild.id}`);
    if (!guild) return;

    if (guild.log) {
      let logChannel = member.guild.channels.get(guild.log);
      if (logChannel) {
        logChannel.send({
          embed: {
            color: member.guild.client.colors.GREEN,
            title: member.guild.client.strings.events(member.guild.language, 'guildMemberAdd'),
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

    if (guild.greet) {
      let greetMessage;
      if (guild.greetMessage) {
        greetMessage = await member.client.functions.decodeString(guild.greetMessage);
      }
      else {
        greetMessage = greetMessages[Math.floor(Math.random() * greetMessages.length)];
      }
      greetMessage = greetMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetMessage = greetMessage.replace(/\$server/ig, member.guild.name);
      greetMessage = greetMessage.replace(/\$username/ig, member.displayName);
      greetMessage = greetMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.config.prefix);

      let greetChannel = member.guild.channels.get(guild.greet);
      if (greetChannel) {
        greetChannel.send({
          embed: {
            color: member.client.colors.BLUE,
            title: `Hello ${member.displayName}`,
            description: greetMessage
          }
        }).then(m => {
          if (guild.greetTimeout > 0) {
            m.delete(1000 * parseInt(guild.greetTimeout)).catch(e => {
              member.client.log.error(e);
            });
          }
        }).catch(e => {
          member.client.log.error(e);
        });
      }
    }

    if (guild.greetPrivate) {
      let greetPrivateMessage;
      if (guild.greetPrivateMessage) {
        greetPrivateMessage = await member.client.functions.decodeString(guild.greetPrivateMessage);
      }
      else {
        greetPrivateMessage = greetMessages[Math.floor(Math.random() * greetMessages.length)];
      }
      greetPrivateMessage = greetPrivateMessage.replace(/\$user/ig, `<@${member.id}>`);
      greetPrivateMessage = greetPrivateMessage.replace(/\$server/ig, member.guild.name);
      greetPrivateMessage = greetPrivateMessage.replace(/\$username/ig, member.displayName);
      greetPrivateMessage = greetPrivateMessage.replace(/\$prefix/ig, member.guild.prefix ? member.guild.prefix[0] : member.client.config.prefix);

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
    if (guild.autoAssignableRoles) {
      autoAssignableRoles = guild.autoAssignableRoles.split(' ');
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
