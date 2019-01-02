/**
 * @file autoDisconnect command
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
    attributes: [ 'musicAutoDisconnect' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, autoDisconnectStatus;
  if (guildModel.dataValues.musicAutoDisconnect) {
    enabled = false;
    color = Bastion.colors.RED;
    autoDisconnectStatus = Bastion.i18n.info(message.guild.language, 'disableMusicAutoDisconnect', message.author.tag);
  }
  else {
    enabled = true;
    color = Bastion.colors.GREEN;
    autoDisconnectStatus = Bastion.i18n.info(message.guild.language, 'enableMusicAutoDisconnect', message.author.tag);
  }

  await Bastion.database.models.guild.update({
    musicAutoDisconnect: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicAutoDisconnect' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: autoDisconnectStatus
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
  name: 'autoDisconnect',
  description: 'Toggles auto disconnect from voice channel. If enabled, Bastion will automatically leave the voice channel to save bandwidth when no one else is connected to it.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'autoDisconnect',
  example: []
};
