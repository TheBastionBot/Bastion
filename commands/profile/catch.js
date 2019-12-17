/**
 * @file catch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (message.channel.robbers && message.channel.robbers.includes(message.author.id)) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'You\'re trying to catch robbers? How ironical? Thieves can\'t catch fellow thieves!'
      }
    }).catch(() => {});
  }

  if (message.channel.robbers && message.channel.robbers.length) {
    // Remove all the robbers.
    delete message.channel.robbers;

    // Reward the catcher.
    Bastion.emit('userDebit', message.member, 1000);

    await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'Thank you for catching the robber. You\'ve been awarded!'
      }
    }).catch(() => {});
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'catch',
  description: 'Catch any robbers, who are stealing %currency.name_plural%, in the channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catch',
  example: []
};
