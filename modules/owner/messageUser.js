/**
 * @file messageUser command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.length || !(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let user = await Bastion.fetchUser(args[0]);

    let DMChannel = await user.createDM();
    DMChannel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      if (e.code === 50007) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), 'Can\'t send message to this user. They might have disabled their DM or they don\'t share a server with me.', message.channel);
      }
      else {
        Bastion.log.error(e);
      }
    });
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
  aliases: [ 'msgu' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageUser',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageUser <user_id> <message>',
  example: [ 'messageUser USER_ID Hello, how are you?' ]
};
