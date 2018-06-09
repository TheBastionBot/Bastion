/**
 * @file commandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const parseArgs = xrequire('command-line-args');
const COLOR = xrequire('chalk');
const _ = xrequire('lodash/core');
const activeUsers = {};

/**
 * Handles Bastion's commands
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'enabled', 'prefix', 'language', 'membersOnly', 'music', 'musicTextChannel', 'musicVoiceChannel', 'musicMasterRole', 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      },
      include: [
        {
          model: message.client.database.models.textChannel,
          attributes: [ 'channelID', 'disabledCommands', 'blacklisted' ]
        },
        {
          model: message.client.database.models.role,
          attributes: [ 'roleID', 'disabledCommands', 'blacklisted' ]
        }
      ]
    });

    if (!guildModel.dataValues.enabled && !message.member.hasPermission('MANAGE_GUILD')) return;

    // Members Only mode. It's < 2 because the everyone has the @everyone role
    // by default which counts as 1.
    if (guildModel.dataValues.membersOnly && !message.member.hasPermission('MANAGE_GUILD') && message.member.roles.size < 2) return;

    // Add guild's prefix to the discord.js guild object to minimize database reads.
    guildModel.dataValues.prefix.concat(message.client.configurations.prefix);
    if (!message.guild.prefix || !_.isEqual(message.guild.prefix, guildModel.dataValues.prefix)) {
      message.guild.prefix = [ ...new Set(guildModel.dataValues.prefix) ];
    }
    // Add guild's language to the discord.js guild object to minimize database reads.
    if (!message.guild.language || message.guild.language !== guildModel.dataValues.language) {
      message.guild.language = guildModel.dataValues.language;
    }
    // Add a music object to the discord.js guild object, to hold music configs.
    if (!message.guild.music) {
      message.guild.music = {};
    }
    // Set music support status of the guild.
    message.guild.music.enabled = guildModel.dataValues.music;
    // If any of the music channels have been removed, delete them from the database.
    if (!message.guild.channels.has(guildModel.dataValues.musicTextChannel) || !message.guild.channels.has(guildModel.dataValues.musicVoiceChannel)) {
      await message.client.database.models.guild.update({
        musicTextChannel: null,
        musicVoiceChannel: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'musicTextChannel', 'musicVoiceChannel' ]
      });
      guildModel.dataValues.musicTextChannel = null;
      guildModel.dataValues.musicVoiceChannel = null;
    }
    // If any of the music channels have been removed, delete them from the database.
    if (!message.guild.roles.has(guildModel.dataValues.musicMasterRole)) {
      await message.client.database.models.guild.update({
        musicMasterRole: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'musicMasterRole' ]
      });
      guildModel.dataValues.musicMasterRole = null;
    }
    // Add music configs to the guild music object.
    message.guild.music.textChannelID = guildModel.dataValues.musicTextChannel;
    message.guild.music.voiceChannelID = guildModel.dataValues.musicVoiceChannel;
    message.guild.music.masterRoleID = guildModel.dataValues.musicMasterRole;

    // The prefix used by the user to call the command.
    let usedPrefix;
    if (!message.guild.prefix.some(prefix => message.content.startsWith(usedPrefix = prefix))) return;

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
    if (message.client.configurations.logLevel === 1) {
      message.client.log.console(COLOR`\n${new Date().toLocaleTimeString()} {cyan ${message.author.tag}} #${message.channel.name} {yellow ${usedPrefix}${command}} ${args.join(' ')}`);
    }
    else if (message.client.configurations.logLevel === 2) {
      message.client.log.console(COLOR`\n${new Date().toLocaleTimeString()} {green ${message.guild.name}} > {yellow #${message.channel.name}}`);
      message.client.log.console(COLOR`{cyan ${message.author.tag}} > {yellow ${usedPrefix}${command}} ${args.join(' ')}`);
    }
    else if (message.client.configurations.logLevel === 3) {
      message.client.log.console(`\n${new Date()}`);
      message.client.log.console(COLOR`{green ${message.guild.name}} / {cyan ${message.guild.id}} > {yellow #${message.channel.name}}/{cyan ${message.channel.id}}`);
      message.client.log.console(COLOR`${message.author.tag} / {cyan ${message.author.id}} > {yellow ${usedPrefix}${command}} ${args.join(' ')}`);
    }
    else if (message.client.configurations.logLevel === 4) {
      message.client.log.console(`\n${new Date()}`);
      if (message.client.shard) {
        message.client.log.console(COLOR`{green Shard ${message.client.shard.id}} > {green ${message.guild.name}} / {cyan ${message.guild.id}} > {yellow #${message.channel.name}}/{cyan ${message.channel.id}}`);
      }
      else {
        message.client.log.console(COLOR`{green ${message.guild.name}} / {cyan ${message.guild.id}} > {yellow #${message.channel.name}}/{cyan ${message.channel.id}}`);
      }
      message.client.log.console(COLOR`${message.author.tag} / {cyan ${message.author.id}}`);
      message.client.log.console(COLOR`{yellow ${usedPrefix}${command}} ${args.join(' ')}`);
    }
    else if (message.client.configurations.logLevel === 5) {
      message.client.log.console(`\n[${new Date()}]`);
      if (message.client.shard) {
        message.client.log.console(COLOR`{green [  SHARD]:} ${message.client.shard.id}`);
      }
      message.client.log.console(COLOR`{green [ SERVER]:} ${message.guild.name} / {cyan ${message.guild.id}}`);
      message.client.log.console(COLOR`{green [CHANNEL]:} ${message.channel.name} / {cyan ${message.channel.id}}`);
      message.client.log.console(COLOR`{green [   USER]:} ${message.author.tag} / {cyan ${message.author.id}}`);
      message.client.log.console(COLOR`{green [COMMAND]:} {yellow ${usedPrefix}${command}} ${args.join(' ')}`);
    }
    else {
      message.client.log.console(`\n[${new Date()}]`);
      if (message.client.shard) {
        message.client.log.console(COLOR`{green [    SHARD]:} ${message.client.shard.id}`);
      }
      message.client.log.console(COLOR`{green [   SERVER]:} ${message.guild.name} / {cyan ${message.guild.id}}`);
      message.client.log.console(COLOR`{green [  CHANNEL]:} ${message.channel.name} / {cyan ${message.channel.id}}`);
      message.client.log.console(COLOR`{green [     USER]:} ${message.author.tag} / {cyan ${message.author.id}}`);
      message.client.log.console(COLOR`{green [  COMMAND]:} ${usedPrefix}${command} / {cyan ${mdl}}`);
      message.client.log.console(COLOR`{green [ARGUMENTS]:} ${args.join(' ') || COLOR`{yellow No arguments to execute}`}`);
    }

    /**
     * Check if a command is used in a blacklisted channel or by a blacklisted
     * role.
     */
    let blacklistedChannels = guildModel.textChannels.length && guildModel.textChannels.filter(model => model.dataValues.blacklisted).map(model => model.dataValues.channelID);
    let blacklistedRoles = guildModel.roles.length && guildModel.roles.filter(model => model.dataValues.blacklisted).map(model => model.dataValues.roleID);

    if ((blacklistedChannels && blacklistedChannels.includes(message.channel.id)) || (blacklistedRoles && message.member.roles.some(role => blacklistedRoles.includes(role.id)))) return message.client.log.info('The command is either used in a blacklisted channel or the user is in a blacklisted role.');

    /**
     * Check if a command is disabled
     */
    if (guildModel.dataValues.disabledCommands) {
      if (guildModel.dataValues.disabledCommands.includes(cmd.help.name.toLowerCase())) {
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

    // Checks for guild owner permission
    if (cmd.config.guildOwnerOnly) {
      if (message.author.id !== message.guild.ownerID) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return message.client.emit('userMissingPermissions', 'GUILD_OWNER');
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
        return message.client.emit('error', '', message.client.i18n.error(message.guild.language, 'cooldown', `<@${message.author.id}>`, cmd.help.name, cmd.config.userCooldown), message.channel);
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
