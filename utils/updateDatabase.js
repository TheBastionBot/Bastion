/**
 * @file updateDatabase
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async db => {
  await db.get('SELECT language FROM guildSettings').catch(() => {
    db.run('ALTER TABLE guildSettings ADD language TEXT DEFAULT \'en\'').catch(() => {});
  });
  await db.get('SELECT birthDate, location FROM profiles').catch(() => {
    db.run('ALTER TABLE profiles ADD birthDate INTEGER location TEXT').catch(() => {});
  });
  await db.run('DROP TABLE IF EXISTS bastionSettings').catch(() => {});
};
