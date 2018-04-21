/**
 * @file claim command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let claimedUsers = [];
const specialIDs = require('../../data/specialIDs.json');

exports.exec = (Bastion, message) => {
  if (!claimedUsers.includes(message.author.id)) {
    let rewardAmount = Bastion.functions.getRandomInt(50, 100);

    let rewardMessage;
    if (Bastion.user.id === '267035345537728512') {
      if (message.guild.id === specialIDs.bastionGuild) {
        rewardAmount *= 2;
        if (message.member && message.member.roles.has(specialIDs.patronsRole)) {
          rewardAmount += 500;
        }
        else if (message.member && message.member.roles.has(specialIDs.donorsRole)) {
          rewardAmount += 100;
        }

        rewardMessage = `Your account has been debited with **${rewardAmount}** Bastion Currencies.`;
      }
      else {
        rewardMessage = `Your account has been debited with **${rewardAmount}** Bastion Currencies.\n\n`
          + '💡 **Pro Tip**\nYou can get **2x** more Bastion Currencies when you use the `claim` or `daily` command in [Bastion HQ](https://discord.gg/fzx8fkt): https://discord.gg/fzx8fkt';
      }
    }
    else {
      rewardMessage = `Your account has been debited with **${rewardAmount}** Bastion Currencies.`;
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
        description: rewardMessage
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
