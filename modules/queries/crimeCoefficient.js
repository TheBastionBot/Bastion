/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (!(user = message.mentions.users.first())) user = message.author;
  user = `${user.username}#${user.discriminator}`;
  let userHash = 0;
  for (let i=0; i < user.length; i++)
    userHash += parseInt(user[i].charCodeAt(0));
  let crimeCoefficient = Math.round(parseFloat('0.' + String(userHash)) * 500) + 1;
  let crimeStat;
  if (crimeCoefficient < 100) crimeStat = 'Suspect is not a target for enforcement action. The trigger of Dominator will be locked.';
  else if (crimeCoefficient < 300) crimeStat = 'Suspect is classified as a latent criminal and is a target for enforcement action. Dominator is set to Non-Lethal Paralyzer mode. Suspect can then be knocked out using the Dominator.';
  else crimeStat = 'Suspect poses a serious threat to the society. Lethal force is authorized. Dominator will automatically switch to Lethal Eliminator. Suspect that is hit by Lethal Eliminator will bloat and explode.';

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: `Crime Coefficient of ${user} is ${crimeCoefficient}`,
    description: crimeStat
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['ccof', 'ccoef']
};

exports.help = {
  name: 'crimecoefficient',
  description: 'Finds the crime coefficient of a mentioned user. If no user is mentioned, it finds the crime coefficient of yours.',
  permission: '',
  usage: 'crimecoefficient [@user-mention]',
  example: ['crimecoefficient', 'crimecoefficient @user#0001']
};
