/**
 * @file greetPrivate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'greetPrivate' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, greetPrivateStats;
    if (guildModel.dataValues.greetPrivate) {
      await Bastion.database.models.guild.update({
        greetPrivate: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greetPrivate' ]
      });
      color = Bastion.colors.RED;
      greetPrivateStats = Bastion.i18n.info(message.guild.language, 'disablePrivateGreetingMessages', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        greetPrivate: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greetPrivate' ]
      });
      color = Bastion.colors.GREEN;
      greetPrivateStats = Bastion.i18n.info(message.guild.language, 'enablePrivateGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetPrivateStats
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
  aliases: [ 'greetprv' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivate',
  description: 'Toggles sending of greeting message as direct message for members who join the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivate',
  example: []
};
