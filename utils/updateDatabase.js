/**
 * @file updateDatabase
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async db => {
  await db.get('SELECT levelUpRoles FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD levelUpRoles TEXT').catch(() => {});
  });
  await db.get('SELECT custom FROM guildShop').catch(() => {
    db.run('ALTER TABLE guildShop ADD custom TEXT').catch(() => {});
  });
  await db.get('SELECT mentionSpamThreshold FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD mentionSpamThreshold INTEGER').catch(() => {});
  });
  await db.get('SELECT mentionSpamAction FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD mentionSpamAction TEXT').catch(() => {});
  });
  await db.get('SELECT disabledCommands FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD disabledCommands TEXT').catch(() => {});
  });
  await db.get('SELECT language FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD language TEXT DEFAULT \'en\'').catch(() => {});
  });
  await db.get('SELECT suggestionChannel FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD suggestionChannel TEXT').catch(() => {});
  });
  await db.get('SELECT votingChannels FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD votingChannels TEXT').catch(() => {});
  });
  await db.get('SELECT birthDate FROM profiles').catch(() => {
    db.run('ALTER TABLE profiles ADD birthDate INTEGER').catch(() => {});
  });
  await db.get('SELECT location FROM profiles').catch(() => {
    db.run('ALTER TABLE profiles ADD location TEXT').catch(() => {});
  });
  await db.run('DROP TABLE IF EXISTS bastionSettings').catch(() => {});
};
