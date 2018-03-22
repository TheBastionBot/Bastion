/**
 * @file unBan command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.reason = args.reason.join(' ');

    let user = await message.guild.unban(args.id, args.reason);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'unban', message.author.tag, user.tag, args.reason)
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, args.reason);
  }
  catch (e) {
    if (e.code === 10013) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'user'), message.channel);
    }
    else {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'ub' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', type: String, alias: 'r', multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'unBan',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'unBan <USER_ID> -r [Reason].',
  example: [ 'unBan 186640658873224631 -r Has apologized for his mistakes' ]
};
