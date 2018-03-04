/**
 * @file commandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const parseArgs = require('command-line-args');
const COLOR = require('chalk');
const activeUsers = {};

/**
 * Handles Bastion's commands
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    let guild = await message.client.db.get(`SELECT prefix, language, musicTextChannel, musicVoiceChannel, musicMasterRole, ignoredChannels, ignoredRoles, disabledCommands FROM guildSettings WHERE guildID=${message.guild.id}`);

    // Add guild's prefix to the discord.js guild object to minimize database reads.
    if (!message.guild.prefix || message.guild.prefix.join(' ') !== `${guild.prefix} ${message.client.config.prefix}`) {
      message.guild.prefix = guild.prefix.trim().split(' ');
      message.guild.prefix.push(message.client.config.prefix);
    }
    // Add guild's language to the discord.js guild object to minimize database reads.
    if (!message.guild.language || message.guild.language !== guild.language) {
      message.guild.language = guild.language;
    }
    // Add a music object to the discord.js guild object, to hold music configs.
    if (!message.guild.music) {
      message.guild.music = {};
    }
    // If any of the music channels have been removed, delete them from the database.
    if (!message.guild.channels.has(guild.musicTextChannel) || !message.guild.channels.has(guild.musicVoiceChannel)) {
      await message.client.db.run(`UPDATE guildSettings SET musicTextChannel=null, musicVoiceChannel=null WHERE guildID=${message.guild.id}`);
      guild.musicTextChannel = null;
      guild.musicVoiceChannel = null;
    }
    // If any of the music channels have been removed, delete them from the database.
    if (!message.guild.roles.has(guild.musicMasterRole)) {
      await message.client.db.run(`UPDATE guildSettings SET musicMasterRole=null WHERE guildID=${message.guild.id}`);
      guild.musicMasterRole = null;
    }
    // Add music configs to the guild music object.
    message.guild.music.textChannelID = guild.musicTextChannel;
    message.guild.music.voiceChannelID = guild.musicVoiceChannel;
    message.guild.music.masterRoleID = guild.musicMasterRole;

    // The prefix used by the user to call the command.
    let usedPrefix;
    if (!message.guild.prefix.some(prefix => message.content.startsWith(usedPrefix = prefix))) return;

    // Ignore commands from ignored roles & channels. Doesn't affect the guild administrator.
    if (message.member && !message.member.hasPermission('ADMINISTRATOR')) {
      if (guild.ignoredChannels) {
        if (guild.ignoredChannels.split(' ').includes(message.channel.id)) return;
      }

      if (guild.ignoredRoles) {
        let ignoredRoles = guild.ignoredRoles.split(' ');
        for (let roleID of ignoredRoles) {
          if (message.member.roles.has(roleID)) return;
        }
      }
    }

    /**
     * @var {String} args The arguments used with the command.
     * @var {String} command The command name.
     */
    let args = message.content.split(' ');
    let command = args.shift().slice(usedPrefix.length).toLowerCase();

    // Resolves command name to the actual command (if any).
    let cmd;
    if (message.client.commands.has(command)) {
      cmd = message.client.commands.get(command);
    }
    else if (message.client.aliases.has(command)) {
      cmd = message.client.commands.get(message.client.aliases.get(command).toLowerCase());
    }
    else return;

    /**
     * @var {String} mdl The module that the command belongs to.
     */
    let mdl = cmd.config.module;

    /**
     * Command log messages
     */
    message.client.log.console(`\n[${new Date()}]`);
    message.client.log.console(COLOR.green('[COMMAND]: ') + usedPrefix + command);
    message.client.log.console(COLOR.green('[ARGUMENTs]: ') + (args.join(' ') || COLOR.yellow('No arguments to execute')));
    message.client.log.console(COLOR.green('[MODULE]: ') + mdl);
    if (message.client.shard) {
      message.client.log.console(`${COLOR.green('[SHARD]:')} ${message.client.shard.id}`);
    }
    message.client.log.console(`${COLOR.green('[SERVER]:')} ${message.guild} ${COLOR.cyan(message.guild.id)}`);
    message.client.log.console(`${COLOR.green('[CHANNEL]:')} #${message.channel.name} ${COLOR.cyan(message.channel)}`);
    message.client.log.console(`${COLOR.green('[USER]:')} ${message.author.tag} ${COLOR.cyan(`${message.author}`)}`);

    /**
     * Check if a command is disabled
     */
    if (guild.disabledCommands) {
      guild.disabledCommands = guild.disabledCommands.split(' ');
      if (guild.disabledCommands.includes(cmd.help.name.toLowerCase())) {
        return message.client.log.info('This command is disabled.');
      }
    }

    /**
     * Command permissions handler
     */
    // Checks for bot owner permission
    if (cmd.config.ownerOnly) {
      if (!message.client.credentials.ownerId.includes(message.author.id)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return message.client.emit('userMissingPermissions', 'BOT_OWNER');
      }
    }

    // Checks for music master permission
    if (cmd.config.musicMasterOnly) {
      if (!message.client.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.masterRoleID)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return message.client.emit('userMissingPermissions', 'MUSIC_MASTER');
      }
    }

    // Checks if the user has the required permission
    if (cmd.help.userTextPermission) {
      if (Object.keys(message.client.permissions).includes(cmd.help.userTextPermission)) {
        if (!message.channel.permissionsFor(message.member) || !message.channel.permissionsFor(message.member).has(cmd.help.userTextPermission)) {
          /**
           * User has missing permissions.
           * @fires userMissingPermissions
           */
          return message.client.emit('userMissingPermissions', cmd.help.userTextPermission);
        }
      }
    }

    // Checks if Bastion has the required permission
    if (cmd.help.botPermission) {
      if (!message.channel.permissionsFor(message.guild.me) || !message.channel.permissionsFor(message.guild.me).has(cmd.help.botPermission)) {
        /**
        * Bastion has missing permissions.
        * @fires bastionMissingPermissions
        */
        return message.client.emit('bastionMissingPermissions', cmd.help.botPermission, message);
      }
    }

    /**
     * Command stats
     */
    if (!message.guild.hasOwnProperty('commandAnalytics')) {
      message.guild.commandAnalytics = {};
    }
    message.guild.commandAnalytics[cmd.help.name] = message.guild.commandAnalytics.hasOwnProperty(cmd.help.name) ? message.guild.commandAnalytics[cmd.help.name] + 1 : 1;

    /**
     * Command cooldown handler
     */
    if (cmd.config.userCooldown && typeof cmd.config.userCooldown === 'number' && cmd.config.userCooldown >= 1 && cmd.config.userCooldown <= 1440) {
      if (!activeUsers.hasOwnProperty(cmd.help.name)) {
        activeUsers[cmd.help.name] = [];
      }
      if (activeUsers[cmd.help.name].includes(message.author.id)) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return message.client.emit('error', message.client.strings.error(message.guild.language, 'cooldown'), message.client.strings.error(message.guild.language, 'cooldown', true, `<@${message.author.id}>`, cmd.help.name, cmd.config.userCooldown), message.channel);
      }
    }

    let isSuccessRun = await cmd.exec(message.client, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));

    if (isSuccessRun === true) {
      if (activeUsers.hasOwnProperty(cmd.help.name)) {
        activeUsers[cmd.help.name].push(message.author.id);
        message.client.setTimeout(() => {
          activeUsers.splice(activeUsers.indexOf(message.author.id), 1);
        }, cmd.config.userCooldown * 1000);
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
