/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async member => {
  // Greet Message
  let guild = await member.client.db.get(`SELECT greet, greetMessage, greetChannelID, greetTimeout, greetDM, greetDMMessage, autoAssignableRoles FROM guildSettings WHERE guildID=${member.guild.id}`).catch(e => {
    member.client.log.error(e);
  });

  if (guild && guild.greet === 'true') {
    let greetMsg = guild.greetMessage;
    greetMsg = greetMsg.replace(/\$user/ig, `<@${member.id}>`);
    greetMsg = greetMsg.replace(/\$server/ig, member.guild.name);
    greetMsg = greetMsg.replace(/\$username/ig, member.displayName);
    greetMsg = greetMsg.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

    member.guild.channels.get(guild.greetChannelID).send({
      embed: {
        color: member.client.colors.green,
        title: `Hello ${member.displayName}`,
        description: greetMsg
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

  if (guild && guild.greetDM === 'true') {
    let greetDMMsg = guild.greetDMMessage;
    greetDMMsg = greetDMMsg.replace(/\$user/ig, `<@${member.id}>`);
    greetDMMsg = greetDMMsg.replace(/\$server/ig, member.guild.name);
    greetDMMsg = greetDMMsg.replace(/\$username/ig, member.displayName);
    greetDMMsg = greetDMMsg.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

    member.send({
      embed: {
        color: member.client.colors.green,
        title: `Hello ${member.displayName}`,
        description: greetDMMsg
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
