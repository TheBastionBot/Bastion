/**
 * @file steal command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  // One human can only rob one person at a time.
  if (message.channel.robbers && message.channel.robbers.includes(message.author.id)) return;

  if (!args.id || !message.channel.members.has(args.id)) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.channel.members.get(args.id);
  user = user.user;

  let guildMemberModel = await Bastion.database.models.guildMember.findOne({
    attributes: [ 'bastionCurrencies' ],
    where: {
      userID: user.id,
      guildID: message.guild.id
    }
  });

  // Check if the user has enough money.
  if (guildMemberModel.dataValues.bastionCurrencies < 10) {
    return Bastion.emit('error', '', `${user.tag} doesn't have enough Bastion Currencies.`, message.channel);
  }

  // This is how much the robber will steal.
  guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);
  let stealAmount = Bastion.methods.getRandomInt(5, guildMemberModel.dataValues.bastionCurrencies / 2);


  // This is how long (in minutes) it'll take to complete the robbery.
  let robberyTime = Bastion.methods.getRandomInt(1, 10);

  // Notify about the robbery.
  let notification = await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: 'A robbery is in progress in this channel. `catch` the thief before they are gone!'
    }
  });

  // Add the robber to the list.
  if (!message.channel.robbers) message.channel.robbers = [];
  message.channel.robbers.push(message.author.id);


  // After the robbery is complete...
  Bastion.setTimeout(() => {
    // If the robber hasn't been caught...
    if (message.channel.robbers && message.channel.robbers.includes(message.author.id)) {
      // Delete the robbery notification and command.
      if (notification.deletable) notification.delete().catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      // Remove the robber from the list.
      message.channel.robbers.splice(message.channel.robbers.indexOf(message.author.id), 1);

      // Update Bastion Currencies for both the parties.
      if (message.channel.members.has(user.id)) {
        Bastion.emit('userCredit', message.channel.members.get(user.id), stealAmount);
        Bastion.emit('userDebit', message.member, stealAmount);
      }
    }
  }, robberyTime * 60000);
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'steal',
  description: 'Steal some %currency.name_plural% from the specified member.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'steal <USER_ID>',
  example: [ 'steal 129660968579749313' ]
};
