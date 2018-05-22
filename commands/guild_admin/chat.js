/**
 * @file chat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    if (!Bastion.credentials.cleverbotAPIkey) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noCredentials', 'Cleverbot API'), message.channel);
    }

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'chat' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, chatStats;
    if (guildModel.dataValues.chat) {
      await Bastion.database.models.guild.update({
        chat: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'chat' ]
      });
      color = Bastion.colors.RED;
      chatStats = Bastion.i18n.info(message.guild.language, 'disableChat', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        chat: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'chat' ]
      });
      color = Bastion.colors.GREEN;
      chatStats = Bastion.i18n.info(message.guild.language, 'enableChat', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: chatStats
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
  name: 'chat',
  description: 'Toggles %bastion%\'s chatting module.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'chat',
  example: []
};
