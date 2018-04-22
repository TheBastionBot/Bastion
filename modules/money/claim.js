/**
 * @file claim command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const specialIDs = require('../../data/specialIDs.json');

exports.exec = (Bastion, message) => {
  if (!message.guild.claimedUsers) {
    message.guild.claimedUsers = [];
  }

  if (!message.guild.claimedUsers.includes(message.author.id)) {
    let rewardAmount = Bastion.functions.getRandomInt(50, 100);

    if (Bastion.user.id === '267035345537728512') {
      if (message.guild.id === specialIDs.bastionGuild) {
        if (message.member && message.member.roles.has(specialIDs.patronsRole)) {
          rewardAmount += 500;
        }
        else if (message.member && message.member.roles.has(specialIDs.donorsRole)) {
          rewardAmount += 100;
        }
      }
    }

    Bastion.emit('userDebit', message.member, rewardAmount);
    message.guild.claimedUsers.push(message.author.id);
    setTimeout(() => {
      message.guild.claimedUsers.splice(message.guild.claimedUsers.indexOf(message.author.id), 1);
    }, Bastion.functions.msUntilMidnight());

    /**
    * Send a message in the channel to let the user know that the operation was successful.
    */
    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author} You've claimed your daily reward. Please check my message in your DM to see the reward amount.`
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
        description: `Your account, in **${message.guild.name}** Server, has been debited with **${rewardAmount}** Bastion Currencies.`
      }
    }).catch(e => {
      if (e.code !== 50007) {
        Bastion.log.error(e);
      }
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
