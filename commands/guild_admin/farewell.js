/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */
// I don't understand why this is even needed, but some fellows like this.

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'farewell' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, farewellStats;
    if (guildModel.dataValues.farewell === message.channel.id) {
      await Bastion.database.models.guild.update({
        farewell: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'farewell' ]
      });
      color = Bastion.colors.RED;
      farewellStats = Bastion.i18n.info(message.guild.language, 'disableFarewellMessages', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        farewell: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'farewell' ]
      });
      color = Bastion.colors.GREEN;
      farewellStats = Bastion.i18n.info(message.guild.language, 'enableFarewellMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: farewellStats
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
  enabled: true
};

exports.help = {
  name: 'farewell',
  description: 'Toggles sending of farewell message for members who left the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewell',
  example: []
};
