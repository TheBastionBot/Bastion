/**
 * @file textMute command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

  try {
    if (args.reason) {
      args.reason = args.reason.filter(str => !str.startsWith('<@') || !str.endsWith('>'));
    }
    args.reason = args.reason && args.reason.length ? args.reason.join(' ') : 'No reason given';

    if (args.server) {
      let mutedRole = message.guild.roles.find('name', 'Bastion:mute');
      if (!mutedRole) {
        mutedRole = await message.guild.createRole({ name:'Bastion:mute' });
      }

      let member = message.guild.members.get(user.id);
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
        title: 'Text muted',
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
            value: args.reason,
            inline: false
          }
        ]
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
