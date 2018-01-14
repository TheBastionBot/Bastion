/**
 * @file resetDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.profiles) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    await Bastion.db.run('DELETE FROM profiles');

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Bastion `profiles` database was successfully reset.'
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
  aliases: [ 'resetdb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'profiles', type: Boolean, alias: 'p' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'resetDatabase',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetDatabase < --profiles >',
  example: [ 'resetDatabase --profiles' ]
};
