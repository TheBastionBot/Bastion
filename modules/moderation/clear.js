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

exports.run = function(Bastion, message, args) {
  if (!message.guild.members.get(message.author.id).hasPermission("MANAGE_MESSAGES")) return Bastion.log.info('You don\'t have permissions to use this command.');

  user = message.mentions.users.first();
  amount = parseInt(args[0]) ? args[0] : args[1];
  amount = /^[1-9][0-9]?$|^100$/.test(amount) ? parseInt(amount) : 100;

  message.channel.fetchMessages({
    limit: amount
  }).then(msgs => {
    if (user) msgs = msgs.filter(m => m.author.id === user.id).array().slice(0, amount);
    message.channel.bulkDelete(msgs).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['clr']
};

exports.help = {
  name: 'clear',
  description: 'Delete a bulk of messages from a channel specified by an user & number. If no user is specified, delete everyone\'s messages. If no amount is specified, it defaults to 100 messages.',
  permission: 'Manage Messages',
  usage: ['clear 50', 'clear @user#0001', 'clear']
};
