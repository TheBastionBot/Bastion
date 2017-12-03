/**
 * @file setGame command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length >= 1) {
      await Bastion.user.setPresence({
        game: {
          name: args.join(' '),
          type: 0
        }
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s game is now set to **${args.join(' ')}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await Bastion.user.setPresence({
        game: {
          name: Bastion.config.game,
          type: 0
        }
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s game is now set to the default game **${Bastion.config.game}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'setg' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setGame',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setGame [text]',
  example: [ 'setGame with minions!', 'setGame' ]
};
