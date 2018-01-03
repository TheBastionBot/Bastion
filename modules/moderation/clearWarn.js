/**
 * @file clearWarn command
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

    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No given reason';
    }

    if (!message.guild.warns) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), 'Everyone is decent here, no one has been warned.', message.channel);
    }
    if (!message.guild.warns.hasOwnProperty(user.id)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), `Nah, ${user.tag} is good guy, he hasn't been warned.`, message.channel);
    }

    delete message.guild.warns[user.id];
    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author.tag} cleared the warnings for ${user.tag} with reason **${reason}**`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'warnClear' ],
  enabled: true
};

exports.help = {
  name: 'clearWarn',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'clearWarn @user-mention [Reason]',
  example: [ 'clearWarn @user#0001 Reason for clearing the warning.' ]
};
