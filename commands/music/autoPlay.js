/**
 * @file autoPlay command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (!message.guild.music.enabled) {
    if (Bastion.user.id === '267035345537728512') {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'musicAutoPlay' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, autoPlayStatus;
  if (guildModel.dataValues.musicAutoPlay) {
    enabled = false;
    color = Bastion.colors.RED;
    autoPlayStatus = Bastion.i18n.info(message.guild.language, 'disableMusicAutoPlay', message.author.tag);
  }
  else {
    enabled = true;
    color = Bastion.colors.GREEN;
    autoPlayStatus = Bastion.i18n.info(message.guild.language, 'enableMusicAutoPlay', message.author.tag);
  }

  await Bastion.database.models.guild.update({
    musicAutoPlay: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicAutoPlay' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: autoPlayStatus
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'autoPlay',
  description: 'Toggles auto playing of music.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'autoPlay',
  example: []
};
