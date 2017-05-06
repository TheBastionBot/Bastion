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
  if (args.length < 1 || args.join('').length < 2) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.join('').toLowerCase();
  let commands = Bastion.commands.map(c => c.help.name).filter(c => c.includes(args));
  if (commands.length == 0) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `No command was found which contains *${args}*.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  message.channel.send({embed: {
    color: Bastion.colors.yellow,
    title: 'Command Search',
    description: `Found ${commands.length} commands containing *${args}*.`,
    fields: [
      {
        name: 'Commands',
        value: `${Bastion.config.prefix}${commands.join(`\n${Bastion.config.prefix}`)}`
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['cmdsearch'],
  enabled: true
};

exports.help = {
  name: 'commandsearch',
  description: 'Search for a Bastion\'s command with a given text.',
  botPermission: '',
  userPermission: '',
  usage: 'commandSearch <text>',
  example: ['commandSearch user']
};
