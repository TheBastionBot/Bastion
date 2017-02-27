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
  message.channel.sendMessage('', {embed: {
    color: 3050327,
    title: 'Support Bastion BOT project',
    description: `You can support the Bastion BOT project on patreon: https://patreon.com/snkrsnkampa\n\nOR\n\nYou can send donations to https://paypal.me/snkrsnkampa\n\nDon't forget to leave your Discord username and/or user id in the message.\n\nThank you :hearts:️`,
  }});
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'donate',
  description: 'Instructions on how to financially help the Bastion BOT project.',
  permission: '',
  usage: ['donate']
};
