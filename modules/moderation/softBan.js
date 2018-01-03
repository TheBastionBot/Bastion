/**
 * @file softBan command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user = message.mentions.users.first();
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let member = await message.guild.fetchMember(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

    if (!member.bannable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'soft-ban', user), message.channel);
    }

    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    await member.ban({
      days: 7,
      reason: reason
    });

    await message.guild.unban(user.id).catch(e => {
      Bastion.log.error(e);
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          title: 'Soft-Ban Error',
          description: 'Banned but unable to unban. Please unban the following user.',
          fields: [
            {
              name: 'User',
              value: user.tag,
              inline: true
            },
            {
              name: 'ID',
              value: user.id,
              inline: true
            }
          ]
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `${message.author.tag} soft-banned ${user.tag} with reason **${reason}**`,
        footer: {
          text: `ID ${user.id}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `${message.author.tag} soft-banned you from **${message.guild.name}** server with reason **${reason}**`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'sb' ],
  enabled: true
};

exports.help = {
  name: 'softBan',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'softBan @user-mention [Reason]',
  example: [ 'softBan @user#0001 Reason for soft ban.' ]
};
