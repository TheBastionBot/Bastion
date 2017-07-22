/**
 * @file commandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const parseArgs = require('command-line-args');
const COLOR = require('chalk');

/**
 * Handles Bastion's commands
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    let guild = await message.client.db.get(`SELECT prefix FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!message.guild.prefix || message.guild.prefix !== guild.prefix) {
      message.guild.prefix = guild.prefix;
    }

    if (!message.content.startsWith(guild.prefix)) return;

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
  catch (e) {
    message.client.log.error(e);
  }
};
