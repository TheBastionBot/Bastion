/**
 * @file textMute command
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

    args.reason = args.reason.join(' ');

    if (args.server) {
      let mutedRole = message.guild.roles.find('name', 'Bastion:mute');
      if (!mutedRole) {
        mutedRole = await message.guild.createRole({ name:'Bastion:mute' });
      }

      await member.addRole(mutedRole, args.reason);

      for (let channel of message.guild.channels.filter(channel => channel.type === 'text')) {
        channel = channel[1];
        if (!channel.permissionOverwrites.get(mutedRole.id)) {
          await channel.overwritePermissions(mutedRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        }
      }
    }
    else {
      await message.channel.overwritePermissions(user, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      }, args.reason);

      if (args.timeout) {
        args.timeout = Math.abs(args.timeout);

        if (!args.timeout || args.timeout > 1440) args.timeout = 1440;

        Bastion.setTimeout(async () => {
          try {
            let permissionOverwrites = message.channel.permissionOverwrites.get(user.id);
            if (permissionOverwrites) {
              await permissionOverwrites.delete();
            }
          }
          catch (e) {
            Bastion.log.error(e);
          }
        }, args.timeout * 60 * 1000);
      }
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: `${message.author.tag} text-muted ${user.tag}${args.timeout ? ` for ${args.timeout} minutes ` : ' '}with reason **${args.reason}**`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason, {
      channel: message.channel
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'tm' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] },
    { name: 'server', type: Boolean, alias: 's' },
    { name: 'timeout', type: Number, alias: 't' }
  ]
};

exports.help = {
  name: 'textMute',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'textMute < @USER_MENTION | USER_ID > [-r Reason] [--server] [-t MINUTES]',
  example: [ 'textMute @user#0001 -r off topic discussions -t 15', 'textMute 167147569575323761 -r misbehaving with others --server' ]
};
