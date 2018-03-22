/**
 * @file lastSeen command
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
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let color, description;
    if (user.lastMessageID) {
      let lastSeen = Date.now() - user.lastMessage.createdTimestamp;
      let seconds = lastSeen / 1000;
      let days = parseInt(seconds / 86400);
      seconds = seconds % 86400;
      let hours = parseInt(seconds / 3600);
      seconds = seconds % 3600;
      let minutes = parseInt(seconds / 60);
      seconds = parseInt(seconds % 60);

      lastSeen = `${seconds}s`;
      if (days) {
        lastSeen = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      else if (hours) {
        lastSeen = `${hours}h ${minutes}m ${seconds}s`;
      }
      else if (minutes) {
        lastSeen = `${minutes}m ${seconds}s`;
      }

      color = Bastion.colors.BLUE;
      description = Bastion.strings.info(message.guild.language, 'lastSeen', user.tag, lastSeen);
    }
    else {
      color = Bastion.colors.RED;
      description = Bastion.strings.info(message.guild.language, 'notSeen', user.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Last seen',
        description: description
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
  aliases: [ 'seen' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'lastSeen',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lastSeen <@USER_MENTION | USER_ID>',
  example: [ 'lastSeen @Bastion#0001', 'lastSeen 167144269485733961' ]
};
