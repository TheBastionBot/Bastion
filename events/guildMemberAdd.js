/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  let guild = await member.client.db.get(`SELECT greet, greetMessage, greetTimeout, greetPrivate, greetPrivateMessage, autoAssignableRoles FROM guildSettings WHERE guildID=${member.guild.id}`).catch(e => {
    member.client.log.error(e);
  });

  if (guild && guild.greet) {
    let greetMessage = 'Welcome to $server! Enjoy your time here.';
    if (guild.greetMessage) {
      greetMessage = await member.client.decodeString(guild.greetMessage);
    }
    greetMessage = greetMessage.replace(/\$user/ig, `<@${member.id}>`);
    greetMessage = greetMessage.replace(/\$server/ig, member.guild.name);
    greetMessage = greetMessage.replace(/\$username/ig, member.displayName);
    greetMessage = greetMessage.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

    member.guild.channels.get(guild.greet).send({
      embed: {
        color: member.client.colors.green,
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

  if (guild && guild.greetPrivate === 'true') {
    let greetPrivateMessage = 'Welcome to $server! Enjoy your time here.';
    if (guild.greetPrivateMessage) {
      greetPrivateMessage = await member.client.decodeString(guild.greetPrivateMessage);
    }
    greetPrivateMessage = greetPrivateMessage.replace(/\$user/ig, `<@${member.id}>`);
    greetPrivateMessage = greetPrivateMessage.replace(/\$server/ig, member.guild.name);
    greetPrivateMessage = greetPrivateMessage.replace(/\$username/ig, member.displayName);
    greetPrivateMessage = greetPrivateMessage.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

    member.send({
      embed: {
        color: member.client.colors.green,
        title: `Hello ${member.displayName}`,
        description: greetPrivateMessage
      }
    }).catch(e => {
      member.client.log.error(e);
    });
  }

  member.client.emit('serverLog', member.client, member.guild, 'guildMemberAdd', {
    member: member
  });

  if (guild) {
    let autoAssignableRoles = JSON.parse(guild.autoAssignableRoles);
    autoAssignableRoles = autoAssignableRoles.filter(r => member.guild.roles.get(r));
    if (autoAssignableRoles.length > 0) {
      member.guild.members.get(member.id).addRoles(autoAssignableRoles).catch(e => {
        member.client.log.error(e);
      });
    }
  }
};
