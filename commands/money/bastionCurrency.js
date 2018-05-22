/**
 * @file bastionCurrency command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: [ 'bastionCurrencies' ],
      where: {
        userID: args.id,
        guildID: message.guild.id
      }
    });

    let bastionCurrencies = 0;

    if (guildMemberModel) {
      bastionCurrencies = guildMemberModel.dataValues.bastionCurrencies;
    }

    let description = message.author.id === args.id ? `**${args.tag}** you currently have **${bastionCurrencies}** Bastion Currencies in your account.` : `**${args.tag}** currently has **${bastionCurrencies}** Bastion Currencies in their account.`;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
  aliases: [ 'currency', 'money' ],
  enabled: true
};

exports.help = {
  name: 'bastionCurrency',
  description: 'Shows the amount of %currency.name_plural% in the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'bastionCurrency [@user-mention]',
  example: [ 'bastionCurrency', 'bastionCurrency @user#0001' ]
};
