/**
 * @file kick command
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

    if (!member.kickable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'kick', user), message.channel);
    }

    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No given reason';
    }

    await member.kick(reason);

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `${message.author.tag} kicked ${user.tag} with reason **${reason}**`,
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
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, member, reason);

    member.send({
      embed: {
        color: Bastion.colors.RED,
        description: `${message.author.tag} kicked you from **${message.guild.name}** server with reason **${reason}**`
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
  aliases: [ 'k' ],
  enabled: true
};

exports.help = {
  name: 'kick',
  botPermission: 'KICK_MEMBERS',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'kick @user-mention [Reason]',
  example: [ 'kick @user#0001 Reason for the kick.' ]
};
