/**
 * @file help command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.command) {
      let channel, command = args.command.toLowerCase();
      if (Bastion.commands.has(command) || Bastion.aliases.has(command)) {
        if (Bastion.commands.has(command)) {
          command = Bastion.commands.get(command);
        }
        else if (Bastion.aliases.has(command)) {
          command = Bastion.commands.get(Bastion.aliases.get(command).toLowerCase());
        }
        let example = [];
        if (command.help.example.length < 1) {
          example.push('-');
        }
        else {
          for (let i = 0; i < command.help.example.length; i++) {
            example.push(`\`\`\`${message.guild.prefix[0]}${command.help.example[i]}\`\`\``);
          }
        }

        if (args.dm) {
          channel = message.author;
        }
        else {
          channel = message.channel;
        }

        await channel.send({
          embed: {
            color: Bastion.colors.GOLD,
            fields: [
              {
                name: 'Command',
                value: `\`${command.help.name}\``,
                inline: true
              },
              {
                name: 'Aliases',
                value: command.config.aliases.join(', ') || '-',
                inline: true
              },
              {
                name: 'Module',
                value: command.config.module.replace('_', ' ').toTitleCase(),
                inline: true
              },
              {
                name: 'Description',
                value: Bastion.strings.command(message.guild.language, command.config.module, command.help.name),
                inline: false
              },
              {
                name: 'BOT Permissions',
                value: `\`${command.help.botPermission}\`` || '-',
                inline: true
              },
              {
                name: 'User Permissions',
                value: `\`${command.help.userTextPermission}\`` || '-',
                inline: true
              },
              {
                name: 'Usage',
                value: `\`\`\`${message.guild.prefix[0]}${command.help.usage}\`\`\``,
                inline: false
              },
              {
                name: 'Example',
                value: example.join('\n'),
                inline: false
              }
            ],
            footer: {
              text: command.config.enabled ? '' : 'This command is temporarily disabled.'
            }
          }
        });
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
      }
    }
    else {
      message.channel.send({
        embed: {
          color: Bastion.colors.GOLD,
          title: 'Help',
          description: `To get a list of commands, type \`${message.guild.prefix[0]}commands\`.\nTo get help about a specific command, type \`${message.guild.prefix[0]}help command_name\`.\n\nNeed help or support with Bastion Discord Bot?\nJoin Bastion Support Server for any help you need.\nhttps://discord.gg/fzx8fkt\n\nSee your DM from me, for invite links.`,
          footer: {
            text: `Server Prefix: ${message.guild.prefix.join(' ')} | Total Commands: ${Bastion.commands.size}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      let authorDMChannel = await message.author.createDM();
      await authorDMChannel.send('https://discord.gg/fzx8fkt', {
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Bastion: Discord Bot',
          url: 'https://BastionBot.org',
          description: 'Join [**Bastion Support Server**](https://discord.gg/fzx8fkt) for testing the commands or any help you need with the bot or maybe just for fun.',
          fields: [
            {
              name: 'Support Server Invite Link',
              value: 'https://discord.gg/fzx8fkt'
            },
            {
              name: 'BOT Invite Link',
              value: `https://discordapp.com/oauth2/authorize?client_id=${Bastion.user.id}&scope=bot&permissions=2146958463`
            }
          ],
          thumbnail: {
            url: Bastion.user.displayAvatarURL
          },
          footer: {
            text: 'Copyright © 2017 - The Bastion Bot Project'
          }
        }
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'h' ],
  enabled: true,
  argsDefinitions: [
    { name: 'command', type: String, alias: 'c', defaultOption: true },
    { name: 'dm', type: Boolean }
  ]
};

exports.help = {
  name: 'help',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'help [command_name [--dm]]',
  example: [ 'help', 'help magic8ball', 'help acrophobia --dm' ]
};
