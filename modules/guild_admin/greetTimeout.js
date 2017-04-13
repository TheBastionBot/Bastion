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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (!/^(([0-2]?[0-9]?[0-9])|300)$/.test(args[0])) {
    args[0] = '0';
  }
  sql.run(`UPDATE guildSettings SET greetTimeout=${args[0]} WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e.stack);
  });

  message.channel.sendMessage('', {embed: {
    color: Bastion.colors.green,
    title: 'Greet Timeout set to:',
    description: args[0] > 60 ? `${args[0] / 60} min.` : args[0] == 0 ? '∞' : `${args[0]} sec.`
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['gtout']
};

exports.help = {
  name: 'greettimeout',
  description: 'Sets the time (in seconds) after which greeting message will be automatically deleted. Supported values: 1 - 300. Any value except the supported values will turn off automatic deletion.',
  permission: '',
  usage: 'greetTimeout [time_in_seconds]',
  example: ['greetTimeout 120', 'greetTimeout']
};
