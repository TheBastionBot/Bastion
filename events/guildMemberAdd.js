/**
 * @file guildMemberAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = member => {
  member.client.db.get(`SELECT greet, greetMessage, greetChannelID, greetTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.greet === 'true') {
      let greetMsg = row.greetMessage;
      greetMsg = greetMsg.replace(/\$user/ig, `<@${member.id}>`);
      greetMsg = greetMsg.replace(/\$server/ig, member.guild.name);
      greetMsg = greetMsg.replace(/\$username/ig, member.displayName);
      greetMsg = greetMsg.replace(/\$prefix/ig, member.guild.prefix || member.client.config.prefix);

      member.guild.channels.get(row.greetChannelID).send({
        embed: {
          color: member.client.colors.green,
          title: `Hello ${member.displayName}`,
          description: greetMsg
        }
      }).then(m => {
        if (row.greetTimeout > 0) {
          m.delete(1000 * parseInt(row.greetTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }).catch(e => {
        member.client.log.error(e);
      });
    }
  }).catch(e => {
    member.client.log.error(e);
  });

  member.client.db.get(`SELECT greetDM, greetDMMessage FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.greetDM === 'true') {
      let greetDMMsg = row.greetDMMessage;
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
      }).then(m => {
        if (row.greetTimeout > 0) {
          m.delete(1000 * parseInt(row.greetTimeout)).catch(e => {
            member.client.log.error(e);
          });
        }
      }).catch(e => {
        member.client.log.error(e);
      });
    }
  }).catch(e => {
    member.client.log.error(e);
  });

  member.client.emit('serverLog', member.client, member.guild, 'guildMemberAdd', {
    member: member
  });

  member.client.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;
    let autoAssignableRoles = JSON.parse(row.autoAssignableRoles);
    autoAssignableRoles = autoAssignableRoles.filter(r => member.guild.roles.get(r));
    if (autoAssignableRoles.length < 1) return;
    member.guild.members.get(member.id).addRoles(autoAssignableRoles).catch(e => {
      member.client.log.error(e);
    });
  }).catch(e => {
    member.client.log.error(e);
  });
};
