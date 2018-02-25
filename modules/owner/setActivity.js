/**
 * @file setActivity command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.name) {
      args.name = args.name.join(' ');

      await Bastion.user.setActivity(args.name, { type: args.type });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `My activity is now set to **${args.type} ${args.name}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let game = typeof Bastion.config.game.name === 'string' ? Bastion.config.game.name : Bastion.config.game.name.length ? Bastion.config.game.name[0] : null;
      await Bastion.user.setActivity(game, { type: Bastion.config.game.type });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `My activity has been reset to the default: **${Bastion.config.game.type} ${game}**`
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
  aliases: [ 'setGame' ],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'type', type: String, alias: 't', defaultValue: 'Playing' }
  ]
};

exports.help = {
  name: 'setActivity',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setActivity [ ACTIVITY NAME [-t ACTIVITY_TYPE] ]',
  example: [ 'setActivity minions! -t Watching', 'setActivity with you', 'setActivity' ]
};
