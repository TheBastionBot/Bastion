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
  if (args.length < 1 || !/^(.+( ?\/ ?.+[^/])+)$/i.test(args = args.join(' '))) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.split('/');
  message.channel.send({embed: {
    color: Bastion.colors.blue,
    title: 'In my opinion',
    description: args[Math.floor(Math.random() * args.length)]
    // description: args.split('/').random()
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['decide'],
  enabled: true
};

exports.help = {
  name: 'choose',
  description: 'Ask the bot to choose a option from any number of options, separated by a `/`.',
  botPermission: '',
  userPermission: '',
  usage: 'choose <choice1>/<choice2>[/<choice3>][...]',
  example: ['choose Chocolate/Ice Cream/Cake']
};
