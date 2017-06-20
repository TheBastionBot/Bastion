/**
 * @file message event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CLEVERBOT = require('cleverbot-node');
const parseArgs = require('command-line-args');
const CREDENTIALS = require('../settings/credentials.json');
const BOT = new CLEVERBOT;
BOT.configure({
  botapi: CREDENTIALS.cleverbotAPIkey
});
const COLOR = require('chalk');
const credentialsFilter = require('../utils/credentialsFilter');
const wordFilter = require('../utils/wordFilter');
const linkFilter = require('../utils/linkFilter');
const inviteFilter = require('../utils/inviteFilter');
const handleTrigger = require('../handlers/triggerHandler');
const levelUp = require('../utils/levelUp');

module.exports = message => {
  /**
   * Filter Bastion's credentials from the message
   */
  credentialsFilter(message);

  if (message.author.bot) return;

  if (message.guild) {
    /**
     * Filter specific words from the message
     */
    wordFilter(message);

    /**
     * Filter links from the message
     */
    linkFilter(message);

    /**
     * Filter Discord server invites from the message
     */
    inviteFilter(message);

    /**
     * Check if the message contains a trigger and respond to it
     */
    handleTrigger(message);

    message.client.db.all('SELECT userID FROM blacklistedUsers').then(users => {
      if (users.map(u => u.userID).includes(message.author.id)) return;

      /**
       * Increase experience and level up user
       */
      levelUp(message);

      message.client.db.get(`SELECT prefix FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
        if (message.content.startsWith(guild.prefix)) {
          let args = message.content.split(' ');
          let command = args.shift().slice(guild.prefix.length).toLowerCase();

          let cmd;
          if (message.client.commands.has(command)) {
            cmd = message.client.commands.get(command);
          }
          else if (message.client.aliases.has(command)) {
            cmd = message.client.commands.get(message.client.aliases.get(command));
          }
          else return;

          message.client.log.console(`\n[${new Date()}]`);
          message.client.log.console(COLOR.green('[COMMAND]: ') + guild.prefix + command);
          message.client.log.console(COLOR.green('[ARGUMENTs]: ') + (args.join(' ') || COLOR.yellow('No arguments to execute')));
          message.client.log.console(`${COLOR.green('[SERVER]:')} ${message.guild} ${COLOR.cyan(`<#${message.guild.id}>`)}`);
          message.client.log.console(`${COLOR.green('[CHANNEL]:')} #${message.channel.name} ${COLOR.cyan(message.channel)}`);
          message.client.log.console(`${COLOR.green('[USER]:')} ${message.author.tag} ${COLOR.cyan(`${message.author}`)}`);

          if (!cmd.config.enabled) {
            return message.client.log.info('This command is disabled.');
          }
          cmd.run(message.client, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
        }
      }).catch(e => {
        message.client.log.error(e.stack);
      });

      if (message.content.startsWith(`<@${message.client.credentials.botId}>`) || message.content.startsWith(`<@!${message.client.credentials.botId}>`)) {
        message.client.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
          if (guild.chat === 'false') return;

          let args = message.content.split(' ');
          if (args.length < 1) return;

          try {
            BOT.write(args.join(' '), function (response) {
              message.channel.startTyping();
              setTimeout(function () {
                message.channel.send(response.output).then(() => {
                  message.channel.stopTyping();
                }).catch(e => {
                  message.client.log.error(e.stack);
                });
              }, response.output.length * 100);
            });
          }
          catch (e) {
            message.client.log.error(e.stack);
          }
        }).catch(e => {
          message.client.log.error(e.stack);
        });
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }
  else {
    if (message.content.startsWith(`${message.client.config.prefix}h`) || message.content.startsWith(`${message.client.config.prefix}help`)) {
      return message.channel.send({
        embed: {
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
        }
      }).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }
};
