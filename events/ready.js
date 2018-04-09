/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = async Bastion => {
  try {
    if (Bastion.shard && Bastion.shard.id + 1 === Bastion.shard.count) {
      await Bastion.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    Bastion.user.setPresence({
      status: Bastion.config.status,
      game: {
        name: typeof Bastion.config.game.name === 'string' ? Bastion.config.game.name : Bastion.config.game.name.length ? Bastion.config.game.name[0] : null,
        type: Bastion.config.game.type,
        url: Bastion.config.game.url && Bastion.config.game.url.trim().length ? Bastion.config.game.url : null
      }
    });

    if (typeof Bastion.config.game.name !== 'string' && Bastion.config.game.name.length) {
      Bastion.setInterval(async () => {
        try {
          await Bastion.user.setActivity(Bastion.config.game.name[Math.floor(Math.random() * Bastion.config.game.name.length)],
            {
              type: Bastion.config.game.type,
              url: Bastion.config.game.url && Bastion.config.game.url.trim().length ? Bastion.config.game.url : null
            });
        }
        catch (e) {
          Bastion.log.error(e);
        }
      }, ((typeof Bastion.config.game.interval === 'number' && Bastion.config.game.interval) || 60) * 60 * 1000);
    }

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
    // for (let i = 0; i < guild.length; i++) {
    //   let found = false;
    //   for (let j = 0; j < bastionGuilds.length; j++) {
    //     if (guild[i] === bastionGuilds[j]){
    //       found = true;
    //       break;
    //     }
    //   }
    //   if (found === false) {
    //     await Bastion.db.run(`DELETE FROM guildSettings WHERE guildID=${guild[i]}`);
    //   }
    // }

    require('../handlers/scheduledCommandHandler')(Bastion);
    require('../handlers/streamNotifier')(Bastion);

    if (Bastion.shard) {
      Bastion.log.console(`${COLOR.cyan(`[${Bastion.user.username}]:`)} Shard ${Bastion.shard.id} is ready with ${Bastion.guilds.size} servers.`);

      Bastion.webhook.send('bastionLog', {
        title: `Launched Shard ${Bastion.shard.id}`,
        description: `Shard ${Bastion.shard.id} is ready with ${Bastion.guilds.size} servers.`,
        footer: {
          icon_url: 'https://resources.bastionbot.org/images/hourglass_loading.gif',
          text: `Launched ${Bastion.shard.id + 1} of ${Bastion.shard.count} shards.`
        },
        timestamp: new Date()
      });
    }

    if (!Bastion.shard || process.env.SHARDS_READY) {
      let guilds = Bastion.shard ? await Bastion.shard.broadcastEval('this.guilds.size') : Bastion.guilds.size;
      if (guilds instanceof Array) {
        guilds = guilds.reduce((sum, val) => sum + val, 0);
      }

      Bastion.log.console('\n');
      Bastion.log.console(COLOR.green('[Author] ') + Bastion.package.author);
      Bastion.log.console(`${COLOR.green('[Bot]')} Bastion v${Bastion.package.version}`);
      Bastion.log.console(COLOR.green('[URL] ') + Bastion.package.url);
      Bastion.log.console(COLOR.green('[Bot ID] ') + Bastion.credentials.botId);
      Bastion.log.console(COLOR.green('[Owner IDs] ') + Bastion.credentials.ownerId.join(', '));
      Bastion.log.console(COLOR.green('[Servers] ') + guilds);
      Bastion.log.console(COLOR.green('[Prefix] ') + Bastion.config.prefix);
      Bastion.log.console(`${COLOR.cyan(`\n[${Bastion.user.username}]:`)} I'm ready to roll! o7`);

      Bastion.webhook.send('bastionLog', {
        color: Bastion.colors.BLUE,
        title: 'I\'m Ready to Roll!',
        description: `Connected to ${guilds} servers${Bastion.shard ? ` in ${Bastion.shard.count} shards` : ''}.`,
        footer: {
          icon_url: 'https://resources.bastionbot.org/logos/Bastion_Logomark_C.png',
          text: `Bastion v${Bastion.package.version}`
        },
        timestamp: new Date()
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
    process.exit(1);
  }
};
