/**
 * @file deleteTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args[0]) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    await Bastion.db.run(`DELETE FROM triggers WHERE trigger="${args.join(' ').replace(/"/g, '\'')}"`);

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Trigger deleted',
        description: args.join(' ')
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
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteTrigger',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
