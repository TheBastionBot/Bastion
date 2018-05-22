/**
 * @file toggleBastion command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'enabled' ],
      where: {
        guildID: message.guild.id
      }
    });

    let enabled, color, description;
    if (guildModel.dataValues.enabled) {
      enabled = false;
      color = Bastion.colors.RED;
      description = Bastion.i18n.info(message.guild.language, 'disableBastion', message.author.tag);
    }
    else {
      enabled = true;
      color = Bastion.colors.GREEN;
      description = Bastion.i18n.info(message.guild.language, 'enableBastion', message.author.tag);
    }

    await Bastion.database.models.guild.update({
      enabled: enabled
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'enabled' ]
    });

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  name: 'toggleBastion',
  description: 'Enable or disable Bastion in your server. Disabling Bastion will prevent everyone, including the server owner, from using it. But if you have enabled any settings that does not need user interaction, it will still work, like starboard, filters, auto assignable roles etc.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'toggleBastion',
  example: []
};
