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

const SQL = require('sqlite');
const CLEVERBOT = require('cleverbot-node');
const CREDENTIALS = require('../settings/credentials.json');
const BOT = new CLEVERBOT;
BOT.configure({
  botapi: CREDENTIALS.cleverbotAPIkey
});
const COLOR = require('chalk');
SQL.open('./data/Bastion.sqlite');

module.exports = message => {
  if (message.content.includes(message.client.token)) {
    if (message.deletable) {
      message.delete().catch(e => {
        message.client.log.error(e.stack);
      });
    }
    message.client.fetchApplication().then(app => {
      message.client.users.get(app.owner.id).send({embed: {
        color: message.client.colors.red,
        title: 'ATTENTION!',
        description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
        fields: [
          {
            name: 'Responsible user',
            value: `${message.author.tag} - ${message.author.id}`
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
  if (message.channel.type === 'dm' || message.channel.type === 'group') {
    if (message.content.startsWith(`${message.client.config.prefix}h`) || message.content.startsWith(`${message.client.config.prefix}help`)) {
      return message.channel.send({embed: {
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
          text: 'Copyright © 2017 Sankarsan Kampa'
        }
      }}).catch(e => {
        message.client.log.error(e.stack);
      });
    }
    else return;
  }

  SQL.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.filterInvite === 'true' && !message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite\/)\/?([a-z0-9-.]+)?/i.test(message.content)) {
        if (message.deletable) {
          message.delete().then(() => {
            SQL.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
              if (!row) return;

              if (row.modLog === 'true') {
                message.guild.channels.get(row.modLogChannelID).send({embed: {
                  color: message.client.colors.orange,
                  title: 'Filtered Invite',
                  fields: [
                    {
                      name: 'Responsible User',
                      value: `${message.author}`,
                      inline: true
                    },
                    {
                      name: 'User ID',
                      value: message.author.id,
                      inline: true
                    }
                  ],
                  footer: {
                    text: `Case Number: ${row.modCaseNo}`
                  },
                  timestamp: new Date()
                }}).then(msg => {
                  SQL.run(`UPDATE guildSettings SET modCaseNo=${parseInt(row.modCaseNo) + 1} WHERE guildID=${message.guild.id}`).catch(e => {
                    message.client.log.error(e.stack);
                  });
                }).catch(e => {
                  message.client.log.error(e.stack);
                });
              }
            }).catch(e => {
              message.client.log.error(e.stack);
            });
          }).catch(e => {
            message.client.log.error(e.stack);
          });
        }
      }
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });

  SQL.all(`SELECT trigger, response FROM triggers`).then(triggers => {
    if (triggers === '') return;

    let trigger = '';
    let response = [];
    for (let i = 0; i < triggers.length; i++) {
      if (message.content.includes(triggers[i].trigger) && !message.content.startsWith(message.client.config.prefix)) {
        trigger = triggers[i].trigger;
        response.push(triggers[i].response);
      }
    }
    response = response[Math.floor(Math.random() * response.length)];
    // response = response.random();
    if (message.content.includes(trigger) && !message.content.startsWith(message.client.config.prefix)) {
      response = response.replace(/\$user/ig, `<@${message.author.id}>`);
      response = response.replace(/\$username/ig, message.author.username);
      response = response.replace(/\$server/ig, `**${message.guild.name}**`);
      response = response.replace(/\$prefix/ig, message.client.config.prefix);
      return message.channel.send(response).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }).catch(() => {
    SQL.run('CREATE TABLE IF NOT EXISTS triggers (trigger TEXT NOT NULL, response TEXT NOT NULL)').catch(e => {
      message.client.log.error(e.stack);
    });
  });

  SQL.all('SELECT userID FROM blacklistedUsers').then(users => {
    if (users.map(u => u.userID).includes(message.author.id)) return;

    SQL.get(`SELECT * FROM profiles WHERE userID=${message.author.id}`).then(profile => {
      if (!profile) {
        SQL.run('INSERT INTO profiles (userID, xp) VALUES (?, ?)', [message.author.id, 1]).catch(e => {
          message.client.log.error(e.stack);
        });
      }
      else {
        let currentLevel = Math.floor(0.1 * Math.sqrt(profile.xp + 1));
        if (currentLevel > profile.level) {
          SQL.run(`UPDATE profiles SET bastionCurrencies=${profile.bastionCurrencies + currentLevel * 5}, xp=${profile.xp + 1}, level=${currentLevel} WHERE userID=${message.author.id}`).catch(e => {
            message.client.log.error(e.stack);
          });
          SQL.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
            if (guild.levelUpMessage === 'false') return;

            message.channel.send({embed: {
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
          SQL.run(`UPDATE profiles SET xp=${profile.xp + 1} WHERE userID=${message.author.id}`).catch(e => {
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
      console.log(COLOR.green(`[COMMAND]: `) + message.client.config.prefix + command);
      if (args.length > 0) {
        console.log(COLOR.green(`[ARGUMENTs]: `) + args.join(' '));
      }
      else {
        console.log(COLOR.green(`[ARGUMENTs]: `) + COLOR.yellow(`No arguments to execute`));
      }
      if (message.channel.type === 'text') {
        console.log(COLOR.green(`[Server]: `) + `${message.guild}` + COLOR.cyan(` <#${message.guild.id}>`));
        console.log(COLOR.green(`[Channel]: `) + `${message.channel.name}` + COLOR.cyan(` ${message.channel}`));
      }
      else {
        console.log(COLOR.green(`[Channel]: `) + 'Direct Message');
      }
      console.log(COLOR.green(`[User]: `) + `${message.author.username}#${message.author.discriminator}` + COLOR.cyan(` ${message.author}`));

      if (!cmd.config.enabled) return message.client.log.info('This command is disabled.');
      if (cmd) {
        cmd.run(message.client, message, args);
      }
    }
    else if (message.content.startsWith(`<@${message.client.credentials.botId}>`) || message.content.startsWith(`<@!${message.client.credentials.botId}>`)) {
      SQL.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
        if (guild.chat === 'false') return;
        let args = message.content.split(' ');
        if (args.length < 1) return;

        try {
          BOT.write(args.join(' '), function (response) {
            message.channel.startTyping();
            setTimeout(function () {
              message.channel.send(response.output).catch(e => {
                message.client.log.error(e.stack);
              });
              message.channel.stopTyping();
            }, response.output.length * 100);
          });
        } catch (e) {
          message.client.log.error(e.stack);
        }
      }).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
