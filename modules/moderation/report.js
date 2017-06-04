/**
 * @file report command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id === user.id) return Bastion.log.info('User can\'t report himself.');
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No reason given';
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'User Reported',
      description: `You have reported **${user.tag}** to the moderators for **${reason}**. They will look into it.`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });

  Bastion.db.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row) return;

    if (row.modLog === 'true') {
      message.guild.channels.get(row.modLogChannelID).send({
        embed: {
          color: Bastion.colors.orange,
          title: 'Reported user',
          fields: [
            {
              name: 'User',
              value: `${user}`,
              inline: true
            },
            {
              name: 'User ID',
              value: user.id,
              inline: true
            },
            {
              name: 'Reason',
              value: reason
            },
            {
              name: 'Reporter',
              value: `${message.author}`,
              inline: true
            },
            {
              name: 'Reporter ID',
              value: message.author.id,
              inline: true
            }
          ],
          footer: {
            text: `Case Number: ${row.modCaseNo}`
          },
          timestamp: new Date()
        }
      }).then(() => {
        Bastion.db.run(`UPDATE guildSettings SET modCaseNo=${parseInt(row.modCaseNo) + 1} WHERE guildID=${message.guild.id}`).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'k' ],
  enabled: true
};

exports.help = {
  name: 'report',
  description: 'Reports a user to the moderators with a given reason.',
  botPermission: '',
  userPermission: '',
  usage: 'report @user-mention [Reason]',
  example: [ 'report @user#0001 Reason for reporting.' ]
};
