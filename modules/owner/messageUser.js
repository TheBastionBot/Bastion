/**
 * @file messageUser command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  try {
    if (!Bastion.credentials.ownerId.includes(message.author.id)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (!args.length || !(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let user = await Bastion.fetchUser(args[0]);

    user.send({
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
  enabled: true
};

exports.help = {
  name: 'messageUser',
  botPermission: '',
  userTextPermission: 'BOT_OWNER',
  usage: 'messageUser <user_id> <message>',
  example: [ 'messageUser USER_ID Hello, how are you?' ]
};
