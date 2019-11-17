/**
 * @file drop command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildMemberModel = await Bastion.database.models.guildMember.findOne({
    attributes: [ 'bastionCurrencies' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });
  guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

  if (guildMemberModel.dataValues.bastionCurrencies < 10) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.bastionCurrencies), message.channel);
  }

  let dropAmount = Bastion.methods.getRandomInt(3, guildMemberModel.dataValues.bastionCurrencies / 2);

  Bastion.emit('userCredit', message.member, dropAmount);

  // Add drop amount to channel.
  if (message.channel.dropAmount) message.channel.dropAmount += dropAmount;
  else message.channel.dropAmount = dropAmount;

  // Send a message in the channel to let the user know that the operation was successful.
  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: `You have dropped **${dropAmount}** Bastion Currencies in this channel.`,
      footer: {
        text: 'The first person to use the `pick` command in this channel gets the dropped currencies.'
      }
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
  name: 'drop',
  description: 'Drops some %currency.name_plural% in the current channel, so anybody can pick it up.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'drop',
  example: []
};
