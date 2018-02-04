/**
 * @file take command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1 || (isNaN(args[0] = parseInt(args[0])) || args[0] < 1)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let user = message.mentions.users.first();
    if (parseInt(args[1]) < 9223372036854775807) {
      user = await Bastion.fetchUser(args[1]);
    }
    if (!user) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'takeNoUser', true), message.channel);
    }
    let reason;
    if (args[2]) {
      reason = args.slice(2).join(' ');
    }
    else {
      reason = 'No reason given.';
    }

    args[0] = Math.abs(args[0]);
    Bastion.emit('userCredit', user, args[0]);
    /**
    * Send a message in the channel to let the Bot Owner know that the operation was successful.
    */
    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `${args[0]} Bastion Currencies has been taken from <@${user.id}>`,
        fields: [
          {
            name: 'Reason',
            value: reason
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Let the user know by DM that their account has been credited.
    */
    user.send({
      embed: {
        color: Bastion.colors.RED,
        description: `Your account has been credited with **${args[0]}** Bastion Currencies.`,
        fields: [
          {
            name: 'Reason',
            value: reason
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 10013) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'takeNoUser', true), message.channel);
    }
    else {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'fine' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'take',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'take <amount> <@user-mention|user_id> [Reason]',
  example: [ 'take 100 @user#0001 Misbehaving', 'take 150 2233445566778899' ]
};
