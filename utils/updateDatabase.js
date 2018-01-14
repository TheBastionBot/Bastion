/**
 * @file updateDatabase
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async db => {
  await db.get('SELECT language FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD language TEXT DEFAULT \'en\'').catch(() => {});
  });
  await db.get('SELECT suggestionChannel FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD suggestionChannel TEXT').catch(() => {});
  });
  await db.get('SELECT birthDate FROM profiles').catch(() => {
    db.run('ALTER TABLE profiles ADD birthDate INTEGER').catch(() => {});
  });
  await db.get('SELECT location FROM profiles').catch(() => {
    db.run('ALTER TABLE profiles ADD location TEXT').catch(() => {});
  });
  await db.run('DROP TABLE IF EXISTS bastionSettings').catch(() => {});
};
