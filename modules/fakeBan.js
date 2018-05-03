/**
 * @file fakeBan command
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

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `**${message.author.tag}** has banned **${user.tag}** from this server.*`,
        footer: {
          text: '* Oh, just kidding! XD'
        }
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
  aliases: [ 'fban' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'fakeBan',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fakeBan [ @USER_MENTION | USER_ID ]',
  example: []
};
