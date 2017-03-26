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
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!/^[0-9]{18}$/.test(args[0])) return;

  if (Bastion.channels.get(args[0]))
    Bastion.channels.get(args[0]).sendMessage('', {embed: {
      color: 6651610,
      description: args.slice(1).join(' ')
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
};

exports.config = {
  aliases: ['msgc']
};

exports.help = {
  name: 'messagechannel',
  description: 'Sends a message to a specified channel (by ID) of a server the bot is connected tos.',
  permission: '',
  usage: 'messageChannel <channel_id> <message>',
  example: ['messageChannel CHANNEL_ID Hello everyone!']
};
