/**
 * @file claim command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let claimedUsers = [];
const specialIDs = require('../../data/specialIDs.json');

exports.exec = (Bastion, message) => {
  if (!claimedUsers.includes(message.author.id)) {
    let rewardAmount;

    if (message.member.roles.has(specialIDs.patronsRole)) {
      rewardAmount = Bastion.functions.getRandomInt(100, 150);
    }
    else if (message.member.roles.has(specialIDs.donorsRole)) {
      rewardAmount = Bastion.functions.getRandomInt(50, 100);
    }
    else {
      rewardAmount = Bastion.functions.getRandomInt(10, 50);
    }

    Bastion.emit('userDebit', message.author, rewardAmount);
    claimedUsers.push(message.author.id);
    setTimeout(() => {
      claimedUsers.splice(claimedUsers.indexOf(message.author.id), 1);
    }, Bastion.functions.msUntilMidnight());

    /**
    * Send a message in the channel to let the user know that the operation was successful.
    */
    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author} You've claimed your daily reward.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Let the user know by DM that their account has been debited.
    */
    message.author.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `Your account has been debited with **${rewardAmount}** Bastion Currencies.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'cooldown'), Bastion.strings.error(message.guild.language, 'claimCooldown', true, message.author), message.channel);
  }
};

exports.config = {
  aliases: [ 'daily' ],
  enabled: true
};

exports.help = {
  name: 'claim',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'claim',
  example: []
};
