/**
 * @file softBan command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await Bastion.fetchUser(args.id);
    }
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

    args.reason = args.reason.join(' ');

    await member.ban({
      days: 7,
      reason: args.reason
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
        description: Bastion.strings.info(message.guild.language, 'softBan', message.author.tag, user.tag, args.reason),
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
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason);

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: Bastion.colors.RED,
        description: Bastion.strings.info(message.guild.language, 'softBanDM', message.author.tag, message.guild.name, args.reason)
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
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'softBan',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'softBan <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'softBan @user#001 -r Spamming in support channel.', 'softBan 167147569575323761 -r Reputed spammer.' ]
};
