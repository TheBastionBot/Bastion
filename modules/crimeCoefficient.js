/**
 * @file crimeCoefficient command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }
  user = user.tag;
  let userHash = 0;
  for (let i = 0; i < user.length; i++) {
    userHash += parseInt(user[i].charCodeAt(0));
  }
  let crimeCoefficient = Math.round(parseFloat(`0.${String(userHash)}`) * 500) + 1;
  let crimeStat;
  if (crimeCoefficient < 100) {
    crimeStat = 'Suspect is not a target for enforcement action. The trigger of Dominator will be locked.';
  }
  else if (crimeCoefficient < 300) {
    crimeStat = 'Suspect is classified as a latent criminal and is a target for enforcement action. Dominator is set to Non-Lethal Paralyzer mode. Suspect can then be knocked out using the Dominator.';
  }
  else {
    crimeStat = 'Suspect poses a serious threat to the society. Lethal force is authorized. Dominator will automatically switch to Lethal Eliminator. Suspect that is hit by Lethal Eliminator will bloat and explode.';
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Crime Coefficient of ${user} is ${crimeCoefficient}`,
      description: crimeStat
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ccof', 'ccoef' ],
  enabled: true
};

exports.help = {
  name: 'crimeCoefficient',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'crimecoefficient [@user-mention]',
  example: [ 'crimecoefficient', 'crimecoefficient @user#0001' ]
};
