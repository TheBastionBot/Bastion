/**
 * @file removeAllRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }
  if (message.author.id !== message.guild.ownerID && user.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(Bastion.strings.error(message.guild.language, 'lowerRole', true));

  try {
    await message.guild.members.get(user.id).removeRoles(message.guild.members.get(user.id).roles);

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'All Roles Removed',
        description: `All roles has been removed from ${user.tag}.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'removeallr' ],
  enabled: true
};

exports.help = {
  name: 'removeAllRoles',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'removeAllRoles [@user-mention]',
  example: [ 'removeAllRoles @user#0001', 'removeAllRoles' ]
};
