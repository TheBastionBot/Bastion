/**
 * @file farewellTimeout command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!/^(([0-2]?[0-9]?[0-9])|300)$/.test(args[0])) {
      args[0] = '0';
    }

    await Bastion.database.models.guild.update({
      farewellTimeout: args[0]
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewellTimeout' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Farewell Timeout set to:',
        description: args[0] > 60 ? `${args[0] / 60} min.` : args[0] === 0 ? '∞' : `${args[0]} sec.`
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
  aliases: [ 'ftout' ],
  enabled: true
};

exports.help = {
  name: 'farewellTimeout',
  description: 'Sets the time after which farewell message will be automatically deleted.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewellTimeout [time_in_seconds]',
  example: [ 'farewellTimeout 120', 'farewellTimeout' ]
};
