/**
 * @file pick command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (message.channel.dropAmount) {
    let dropAmount = message.channel.dropAmount;

    Bastion.emit('userDebit', message.member, dropAmount);

    // Remove dropAmount from the channel.
    delete message.channel.dropAmount;

    // Send a message in the channel to let the user know that the operation was successful.
    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `You have picked **${dropAmount}** Bastion Currencies from this channel.`,
        footer: {
          text: `${dropAmount} Bastion Currencies have been added to your account.`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'pick',
  description: 'Picks all the %currency.name_plural% dropped in the current channel and adds it to your account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pick',
  example: []
};
