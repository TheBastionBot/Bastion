/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = async Bastion => {
  try {
    Bastion.user.setPresence({
      status: Bastion.config.status,
      game: {
        name: Bastion.config.game,
        type: 0
      }
    });

    let bastionGuilds = Bastion.guilds.map(g => g.id);
    let guild = await Bastion.db.all('SELECT guildID from guildSettings');
    guild = guild.map(r => r.guildID);

    /*
    * Add guilds to the DB which added Bastion when it was offline.
    */
    for (let i = 0; i < bastionGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guild.length; j++) {
        if (bastionGuilds[i] === guild[j]){
          found = true;
          break;
        }
      }
      if (found === false) {
        await Bastion.db.run('INSERT INTO guildSettings (guildID) VALUES (?)', [ bastionGuilds[i] ]);
      }
    }

    /*
    * Remove guilds from DB which removed Bastion when it was offline.
    */
    for (let i = 0; i < guild.length; i++) {
      let found = false;
      for (let j = 0; j < bastionGuilds.length; j++) {
        if (guild[i] === bastionGuilds[j]){
          found = true;
          break;
        }
      }
      if (found === false) {
        await Bastion.db.run(`DELETE FROM guildSettings WHERE guildID=${guild[i]}`);
      }
    }

    require('../handlers/scheduledCommandHandler')(Bastion);
    require('../handlers/streamNotifier')(Bastion);

    Bastion.log.console('\n');
    Bastion.log.console(COLOR.green('[Author] ') + Bastion.package.author);
    Bastion.log.console(COLOR.green('[Author URL] ') + Bastion.package.authorUrl);
    Bastion.log.console(COLOR.green('[Library] ') + Bastion.package.library);
    Bastion.log.console(`${COLOR.green('[Bot]')} Bastion v${Bastion.package.version}`);
    Bastion.log.console(COLOR.green('[Bot ID] ') + Bastion.credentials.botId);
    Bastion.log.console(COLOR.green('[Owner IDs] ') + Bastion.credentials.ownerId.join(', '));
    Bastion.log.console(COLOR.green('[Servers] ') + Bastion.guilds.size);
    Bastion.log.console(COLOR.green('[Prefix] ') + Bastion.config.prefix);
    Bastion.log.console(`${COLOR.cyan(`\n[${Bastion.user.username}]:`)} I'm ready to roll! o7`);
  }
  catch (e) {
    Bastion.log.error(e);
    process.exit(1);
  }
};
