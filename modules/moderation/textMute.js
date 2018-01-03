/**
 * @file textMute command
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

    if (args.reason) {
      args.reason = args.reason.filter(str => !str.startsWith('<@') || !str.endsWith('>'));
    }
    args.reason = args.reason && args.reason.length ? args.reason.join(' ') : 'No reason given';

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
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.ORANGE,
        description: `${message.author.tag} text-muted ${user.tag} with reason **${args.reason}**`
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
    { name: 'reason', type: String, multiple: true, defaultOption: true },
    { name: 'server', type: Boolean, alias: 's' }
  ]
};

exports.help = {
  name: 'textMute',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'textMute @user-mention [Reason] [--server]',
  example: [ 'textMute @user#0001 off topic discussions', 'textMute @user#0001 misbehaving others --server' ]
};
