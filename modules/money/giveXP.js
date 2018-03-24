/**
 * @file giveXP command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id || !args.points) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (message.mentions.users.size) {
      args.id = message.mentions.users.first().id;
    }

    let profile = await message.client.db.get(`SELECT xp FROM profiles WHERE userID=${args.id}`);
    if (!profile) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'profileNotCreated', true, `<@${args.id}>`), message.channel);
    }

    args.points = `${parseInt(profile.xp) + parseInt(args.points)}`;

    await message.client.db.run(`UPDATE profiles SET xp=${args.points} WHERE userID=${args.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `<@${args.id}> has been awarded with **${args.points}** experience points.`
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
  aliases: [],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'points', alias: 'n', type: String }
  ]
};

exports.help = {
  name: 'giveXP',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giveXP <@USER_MENTION | USER_ID> <-n POINTS>',
  example: [ 'giveXP @user#0001 -n 100', 'giveXP 242621467230268813 -n 150' ]
};
