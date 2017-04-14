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
const Cleverbot = require('cleverbot');
const credentials = require('../settings/credentials.json');
const bot = new Cleverbot({
  key: credentials.cleverbotAPIkey
});
const chalk = require('chalk');
const getRandomInt = require('../functions/getRandomInt');
sql.open('./data/Bastion.sqlite');

module.exports = message => {
  if (message.content.includes(message.client.token)) {
    if (message.guild) {
      message.delete().catch(e => {
        message.client.log.error(e.stack);
      });
    }
    message.client.fetchApplication().then(app => {
      message.client.users.get(app.owner.id).sendMessage('', {embed: {
        color: message.client.colors.red,
        title: 'ATTENTION!',
        description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
        fields: [
          {
            name: 'Responsible user',
            value: `${message.author.username}#${message.author.discriminator} - ${message.author.id}`
          }
        ]
      }}).catch(e => {
        message.client.log.error(e.stack);
      });
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }

  if (message.author.bot) return;
  if (message.channel.type == 'dm' || message.channel.type == 'group') {
    if (message.content.startsWith(`${message.client.config.prefix}h`) || message.content.startsWith(`${message.client.config.prefix}help`)) {
      return message.channel.sendMessage('', {embed: {
        color: message.client.colors.blue,
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
          url: message.client.user.displayAvatarURL
        },
        footer: {
          icon_url: 'https://sankarsankampa.com/assets/img/logo/snkrsn_32.png',
          text: 'Copyright © 2017 Sankarsan Kampa | @snkrsnkampa'
        }
      }}).catch(e => {
        message.client.log.error(e.stack);
      });
    }
    else return;
  }

  sql.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.filterInvite == 'true' && !message.guild.members.get(message.author.id).hasPermission("ADMINISTRATOR")) {
      if (/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite\/)\/?([a-z0-9-.]+)?/i.test(message.content)) {
        message.delete().catch(e => {
          message.client.log.error(e.stack);
        });
      }
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });

  sql.all(`SELECT trigger, response FROM triggers`).then(triggers => {
    if (triggers == '') return;
    let response = triggers.map(x => x.response)[getRandomInt(0, triggers.length - 1)];
    if (message.content.includes(triggers[0].trigger) && !message.content.startsWith(message.client.config.prefix)) {
      response = response.replace(/\$user/ig, `<@${message.author.id}>`);
      response = response.replace(/\$username/ig, message.author.username);
      response = response.replace(/\$server/ig, `**${message.guild.name}**`);
      response = response.replace(/\$prefix/ig, message.client.config.prefix);
      return message.channel.sendMessage(response).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }).catch(() => {
    sql.run('CREATE TABLE IF NOT EXISTS triggers (trigger TEXT NOT NULL, response TEXT NOT NULL)').catch(e => {
      message.client.log.error(e.stack);
    });
  });

  sql.all('SELECT userID FROM blacklistedUsers').then(users => {
    if (users.map(u => u.userID).includes(message.author.id)) return;

    sql.get(`SELECT * FROM profiles WHERE userID=${message.author.id}`).then(profile => {
      if (!profile) {
        sql.run('INSERT INTO profiles (userID, xp) VALUES (?, ?)', [message.author.id, 1]).catch(e => {
          message.client.log.error(e.stack);
        });
      }
      else {
        let currentLevel = Math.floor(0.1 * Math.sqrt(profile.xp + 1));
        if (currentLevel > profile.level) {
          sql.run(`UPDATE profiles SET bastionCurrencies=${profile.bastionCurrencies+currentLevel*5}, xp=${profile.xp+1}, level=${currentLevel} WHERE userID=${message.author.id}`).catch(e => {
            message.client.log.error(e.stack);
          });
          sql.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
            if (guild.levelUpMessage = 'false') return;

            message.channel.sendMessage('', {embed: {
              color: message.client.colors.blue,
              title: 'Leveled up',
              description: `:up: **${message.author.username}**#${message.author.discriminator} leveled up to **Level ${currentLevel}**`
            }}).catch(e => {
              message.client.log.error(e.stack);
            });
          }).catch(e => {
            message.client.log.error(e.stack);
          });
        }
        else {
          sql.run(`UPDATE profiles SET xp=${profile.xp+1} WHERE userID=${message.author.id}`).catch(e => {
            message.client.log.error(e.stack);
          });
        }
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });

    if (message.content.startsWith(message.client.config.prefix)) {
      let args = message.content.split(' ');
      let command = args.shift().slice(message.client.config.prefix.length).toLowerCase();

      let cmd;
      if (message.client.commands.has(command)) {
        cmd = message.client.commands.get(command);
      }
      else if (message.client.aliases.has(command)) {
        cmd = message.client.commands.get(message.client.aliases.get(command));
      }
      else return;

      console.log(`\n[${new Date()}]`);
      console.log(chalk.green(`[COMMAND]: `) + message.client.config.prefix + command);
      if (args.length > 0) {
        console.log(chalk.green(`[ARGUMENTs]: `) + args.join(' '));
      }
      else {
        console.log(chalk.green(`[ARGUMENTs]: `) + chalk.yellow(`No arguments to execute`));
      }
      if (message.channel.type == 'text') {
        console.log(chalk.green(`[Server]: `) + `${message.guild}` + chalk.cyan(` <#${message.guild.id}>`));
        console.log(chalk.green(`[Channel]: `) + `${message.channel.name}` + chalk.cyan(` ${message.channel}`));
      }
      else {
        console.log(chalk.green(`[Channel]: `) + 'Direct Message');
      }
      console.log(chalk.green(`[User]: `) + `${message.author.username}#${message.author.discriminator}` + chalk.cyan(` ${message.author}`));

      if (cmd) {
        cmd.run(message.client, message, args);
      }
    }
    else if (message.content.startsWith(`<@${message.client.credentials.botId}>`) || message.content.startsWith(`<@!${message.client.credentials.botId}>`)) {
      sql.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
        if (guild.chat == 'false') return;
        let args = message.content.split(' ');
        if (args.length < 1) return;

        bot.query(args.join(' ')).then(response => {
          message.channel.startTyping();
          setTimeout(function () {
            message.channel.sendMessage(response.output).catch(e => {
              message.client.log.error(e.stack);
            });
            message.channel.stopTyping();
          }, response.output.length * 100);
        }).catch(e => {
          message.client.log.error(e.stack);
        });
      }).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
