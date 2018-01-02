/**
 * @file warn command
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
      message.guild.warns = {};
    }
    if (!message.guild.warns.hasOwnProperty(user.id)) {
      message.guild.warns[user.id] = 1;
    }
    else {
      if (message.guild.warns[user.id] >= 2) {
        let guildSettings = await Bastion.db.get(`SELECT warnAction FROM guildSettings WHERE guildID='${message.guild.id}'`);

        if (guildSettings.warnAction) {
          let action;
          if (guildSettings.warnAction === 'kick') {
            if (!member.kickable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to kick ${user}.`, message.channel);
            }
            await member.kick('Warned 3 times!');
            action = 'Kicked';
          }
          if (guildSettings.warnAction === 'softban') {
            if (!member.bannable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to soft-ban ${user}.`, message.channel);
            }
            await member.ban('Warned 3 times!');
            await message.guild.unban(member.id);
            action = 'Soft-Banned';
          }
          if (guildSettings.warnAction === 'ban') {
            if (!member.bannable) {
              /**
              * Error condition is encountered.
              * @fires error
              */
              return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), `I don't have permissions to ban ${user}.`, message.channel);
            }
            await member.ban('Warned 3 times!');
            action = 'Banned';
          }

          delete message.guild.warns[user.id];
          message.channel.send({
            embed: {
              color: Bastion.colors.RED,
              title: action,
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
                },
                {
                  name: 'Reason',
                  value: 'Warned 3 times!',
                  inline: false
                }
              ]
            }
          }).catch(e => {
            Bastion.log.error(e);
          });

          Bastion.emit('moderationLog', message.guild, message.author, guildSettings.warnAction, user, 'Warned 3 times!');

          member.send({
            embed: {
              color: Bastion.colors.RED,
              title: `${action} from ${message.guild.name} Server`,
              fields: [
                {
                  name: 'Reason',
                  value: 'You have been warned 3 times!'
                }
              ]
            }
          }).catch(e => {
            Bastion.log.error(e);
          });
        }
      }
      else {
        message.guild.warns[user.id] += 1;
      }
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: `${message.author.tag} warned ${user.tag} with reason **${reason}**`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: `${message.author.tag} warned you in **${message.guild.name}** server with reason **${reason}**`
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
  aliases: [ 'w' ],
  enabled: true
};

exports.help = {
  name: 'warn',
  botPermission: 'KICK_MEMBERS',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'warn @user-mention [Reason]',
  example: [ 'warn @user#0001 Reason for the warning.' ]
};
