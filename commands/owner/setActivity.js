/**
 * @file setActivity command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
      let game = typeof Bastion.configurations.game.name === 'string' ? Bastion.configurations.game.name : Bastion.configurations.game.name.length ? Bastion.configurations.game.name[0] : null;
      await Bastion.user.setActivity(game, { type: Bastion.configurations.game.type });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `My activity has been reset to the default: **${Bastion.configurations.game.type} ${game}**`
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
  description: 'Sets the activity of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setActivity [ ACTIVITY NAME [-t ACTIVITY_TYPE] ]',
  example: [ 'setActivity minions! -t Watching', 'setActivity with you', 'setActivity' ]
};
