/**
 * @file populateDatabase
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const config = require('../settings/config.json');

module.exports = async db => {
  await db.run('CREATE TABLE IF NOT EXISTS guildSettings' +
    '(guildID TEXT NOT NULL UNIQUE,' +
    `prefix TEXT NOT NULL DEFAULT '${config.prefix || '!'}',` +
    'language TEXT DEFAULT \'en\',' +
    'greet TEXT,' +
    'greetMessage BLOB,' +
    'greetTimeout INTEGER NOT NULL DEFAULT 30,' +
    'greetPrivate INTEGER NOT NULL DEFAULT 0,' +
    'greetPrivateMessage BLOB,' +
    'farewell TEXT UNIQUE,' +
    'farewellMessage BLOB,' +
    'farewellTimeout INTEGER NOT NULL DEFAULT 15,' +
    'log TEXT UNIQUE,' +
    'musicTextChannel TEXT UNIQUE,' +
    'musicVoiceChannel TEXT UNIQUE,' +
    'musicMasterRole TEXT UNIQUE,' +
    'filterInvite INTEGER NOT NULL DEFAULT 0,' +
    'filterLink INTEGER NOT NULL DEFAULT 0,' +
    'whitelistDomains TEXT NOT NULL DEFAULT \'[]\',' +
    'filterWord INTEGER NOT NULL DEFAULT 0,' +
    'filteredWords TEXT,' +
    'slowMode INTEGER NOT NULL DEFAULT 0,' +
    'mentionSpamThreshold INTEGER,' +
    'mentionSpamAction TEXT,' +
    'announcementChannel TEXT,' +
    'chat INTEGER NOT NULL DEFAULT 0,' +
    'levelUpMessage INTEGER NOT NULL DEFAULT 0,' +
    'selfAssignableRoles TEXT,' +
    'autoAssignableRoles TEXT,' +
    'streamerRole TEXT,' +
    'suggestionChannel TEXT UNIQUE,' +
    'votingChannels TEXT UNIQUE,' +
    'levelUpRoles TEXT,' +
    'warnAction TEXT,' +
    'ignoredChannels TEXT,' +
    'ignoredRoles TEXT,' +
    'starboard TEXT UNIQUE,' +
    'modLog TEXT UNIQUE,' +
    'modCaseNo TEXT NOT NULL DEFAULT \'1\',' +
    'disabledCommands TEXT,' +
    'PRIMARY KEY(guildID))');

  await db.run('CREATE TABLE IF NOT EXISTS whitelists' +
    '(guildID TEXT NOT NULL UNIQUE,' +
    'inviteFilterWhitelistChannels TEXT UNIQUE,' +
    'inviteFilterWhitelistRoles TEXT UNIQUE,' +
    'linkFilterWhitelistChannels TEXT UNIQUE,' +
    'linkFilterWhitelistRoles TEXT UNIQUE,' +
    'linkFilterWhitelistDomains TEXT UNIQUE,' +
    'wordFilterWhitelistChannels TEXT UNIQUE,' +
    'wordFilterWhitelistRoles TEXT UNIQUE,' +
    'FOREIGN KEY (guildID) REFERENCES guildSettings (guildID) ON DELETE CASCADE)');

  await db.run('CREATE TABLE IF NOT EXISTS blacklistedUsers' +
    '(userID TEXT NOT NULL UNIQUE,' +
    'PRIMARY KEY(userID))');

  await db.run('CREATE TABLE IF NOT EXISTS profiles' +
    '(userID TEXT NOT NULL UNIQUE,' +
    'bastionCurrencies TEXT NOT NULL DEFAULT 0,' +
    'xp TEXT NOT NULL DEFAULT 0,' +
    'level TEXT NOT NULL DEFAULT 0,' +
    'reputation TEXT NOT NULL DEFAULT 0,' +
    'bio BLOB,' +
    'birthDate INTEGER,' +
    'location TEXT,' +
    'PRIMARY KEY(userID))');

  await db.run('CREATE TABLE IF NOT EXISTS triggers' +
    '(trigger TEXT NOT NULL,' +
    'response TEXT NOT NULL)');

  await db.run('CREATE TABLE IF NOT EXISTS todo' +
    '(ownerID TEXT NOT NULL UNIQUE,' +
    'list TEXT NOT NULL DEFAULT \'[]\')');

  await db.run('CREATE TABLE IF NOT EXISTS scheduledCommands' +
    '(cronExp TEXT NOT NULL,' +
    'command TEXT NOT NULL,' +
    'channelID TEXT NOT NULL,' +
    'messageID TEXT NOT NULL,' +
    'arguments TEXT)');

  await db.run('CREATE TABLE IF NOT EXISTS gifts' +
    '(userID TEXT NOT NULL UNIQUE,' +
    'cookies TEXT,' +
    'chocolate_bars TEXT,' +
    'icecreams TEXT,' +
    'cakes TEXT,' +
    'rings TEXT,' +
    'crowns TEXT,' +
    'gems TEXT,' +
    'gift_hearts TEXT,' +
    'love_letters TEXT)');

  await db.run('CREATE TABLE IF NOT EXISTS shop_items' +
    '(userID TEXT NOT NULL UNIQUE,' +
    'guildID TEXT NOT NULL UNIQUE,' +
    'custom_items TEXT,' +
    'FOREIGN KEY (guildID) REFERENCES guildSettings (guildID) ON DELETE CASCADE,' +
    'FOREIGN KEY (userID) REFERENCES profiles (userID) ON DELETE CASCADE)');

  await db.run('CREATE TABLE IF NOT EXISTS guildShop' +
    '(guildID TEXT NOT NULL UNIQUE,' +
    'roles TEXT,' +
    'custom TEXT)');

  await db.run('CREATE TABLE IF NOT EXISTS transactions' +
    '(userID TEXT NOT NULL,' +
    'type TEXT NOT NULL,' +
    'amount TEXT NOT NULL)');

  await db.run('CREATE TABLE IF NOT EXISTS streamers' +
    '(guildID TEXT NOT NULL UNIQUE,' +
    'channelID TEXT UNIQUE,' +
    'mixer TEXT,' +
    'twitch TEXT,' +
    'youtube TEXT,' +
    'FOREIGN KEY (guildID) REFERENCES guildSettings (guildID) ON DELETE CASCADE)');

  require('./updateDatabase')(db);
};
