/**
 * @file deleteAllTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    await Bastion.db.all('DELETE FROM triggers');

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'Deleted all the triggers and responses.'
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
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteAllTriggers',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteAllTriggers',
  example: []
};
