/**
 * @file greet command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'greet' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, greetStats;
    if (guildModel.dataValues.greet === message.channel.id) {
      await Bastion.database.models.guild.update({
        greet: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greet' ]
      });
      color = Bastion.colors.RED;
      greetStats = Bastion.strings.info(message.guild.language, 'disableGreetingMessages', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        greet: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greet' ]
      });
      color = Bastion.colors.GREEN;
      greetStats = Bastion.strings.info(message.guild.language, 'enableGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetStats
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
  name: 'greet',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greet',
  example: []
};
