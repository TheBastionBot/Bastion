/**
 * @file filterEmojis command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'filterEmojis' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, emojiFilterStatus;
  if (guildModel.dataValues.filterEmojis) {
    enabled = false;
    color = Bastion.colors.RED;
    emojiFilterStatus = Bastion.i18n.info(message.guild.language, 'disableEmojiFilter', message.author.tag);
  }
  else {
    enabled = true;
    color = Bastion.colors.GREEN;
    emojiFilterStatus = Bastion.i18n.info(message.guild.language, 'enableEmojiFilter', message.author.tag);
  }

  await Bastion.database.models.guild.update({
    filterEmojis: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'filterEmojis' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: emojiFilterStatus
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'emojiFilter' ],
  enabled: true
};

exports.help = {
  name: 'filterEmojis',
  description: 'Toggles automatic deleting of messages that are emoji spams. Messages with more than 50% of its content with emojis are considered as emoji spams.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterEmojis',
  example: []
};
