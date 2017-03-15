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
  if (!args[0]) {
    message.channel.sendMessage('', {embed: {
      color: 15451167,
      title: 'Help',
      description: `To get a list of commands, type \`${Bastion.config.prefix}commands\`.\nTo get help about a specific command, type \`${Bastion.config.prefix}help commandName\`.\n\nNeed help or support with Bastion Discord BOT?\nJoin Bastion Support Server for any help you need.\nhttps://discord.gg/fzx8fkt\n\nSee your DM from me, for invite links.`,
      footer: {
        text: `Prefix: ${Bastion.config.prefix} | Total Commands: ${Bastion.commands.size}`
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
    message.author.sendMessage('', {embed: {
      color: 6651610,
      title: 'Bastion Discord BOT',
      url: 'https://bastion.js.org',
      description: 'Join [**Bastion Support Server**](https://discord.gg/fzx8fkt) for testing the commands or any help you need with the bot or maybe just for fun.',
      fields: [
        {
          name: 'Support Server Invite Link',
          value: 'https://discord.gg/fzx8fkt'
        },
        {
          name: 'BOT Invite Link',
          value: `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958463`
        }
      ],
      thumbnail: {
        url: message.client.user.avatarURL
      },
      footer: {
        icon_url: 'https://sankarsankampa.com/assets/img/logo/snkrsn_32.png',
        text: 'Copyright © 2017 Sankarsan Kampa | @snkrsnkampa'
      }
    }}).catch(e => {
      message.client.log.error(e.stack);
    });
  } else {
    let command = args[0];
    if (Bastion.commands.has(command)) {
      command = Bastion.commands.get(command);

      if ((permission = command.help.permission) == '') permission = '-';
      if ((aliases = command.conf.aliases) == '') aliases = '-';
      else aliases = aliases.join(', ');
      let usage = [];
      for (let i = 0; i < command.help.usage.length; i++)
        usage.push(`\`${Bastion.config.prefix}${command.help.usage[i]}\``);

      message.channel.sendMessage('', {embed: {
        color: 16766720,
        title: 'Help',
        description: `To get a list of commands, type \`${Bastion.config.prefix}commands\`.`,
        fields: [
          {
            name: 'Command',
            value: command.help.name,
            inline: true
          },
          {
            name: 'Aliases',
            value: aliases,
            inline: true
          },
          {
            name: 'Description',
            value: command.help.description,
            inline: false
          },
          {
            name: 'Permissions Required',
            value: permission,
            inline: true
          },
          {
            name: 'Usage',
            value: usage.join('\n'),
            inline: true
          }
        ]
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }
};

exports.conf = {
  aliases: ['h']
};

exports.help = {
  name: 'help',
  description: 'Shows all the available commands. If a command name is specified as a argument, shows help about that command.',
  permission: '',
  usage: 'help [command_name]',
  example: ['help', 'help magic8ball']
};
