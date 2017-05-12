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
  message.channel.send({embed: {
    color: Bastion.colors.yellow,
    title: 'Bastion BOT - Guide',
    url: 'https://bastion.js.org/',
    description: `Need help installing and setting up Private Bastion BOT? No worries, we have made an amazing guide to help you out on that. And if you don't understand that or you need any more help or maybe if you just have a simple question, just join our Support Server on Discord.`,
    fields: [
      {
        name: 'Bastion BOT - Installation Guide',
        value: 'https://bastion.js.org/guide/'
      },
      {
        name: 'Bastion BOT - Support Server',
        value: 'https://discord.gg/fzx8fkt'
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'guide',
  description: 'Shows you the guide on how to setup and install Private Bastion BOT. And links to the official support server.',
  botPermission: '',
  userPermission: '',
  usage: 'guide',
  example: []
};
