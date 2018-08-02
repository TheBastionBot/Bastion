/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const COLOR = xrequire('chalk');

module.exports = async Bastion => {
  try {
    if (Bastion.shard && Bastion.shard.id + 1 === Bastion.shard.count) {
      await Bastion.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    Bastion.user.setPresence({
      status: Bastion.configurations.status,
      game: {
        name: typeof Bastion.configurations.game.name === 'string' ? Bastion.configurations.game.name : Bastion.configurations.game.name.length ? Bastion.configurations.game.name[0] : null,
        type: Bastion.configurations.game.type,
        url: Bastion.configurations.game.url && Bastion.configurations.game.url.trim().length ? Bastion.configurations.game.url : null
      }
    });

    if (typeof Bastion.configurations.game.name !== 'string' && Bastion.configurations.game.name.length) {
      Bastion.setInterval(async () => {
        try {
          await Bastion.user.setActivity(Bastion.configurations.game.name[Math.floor(Math.random() * Bastion.configurations.game.name.length)],
            {
              type: Bastion.configurations.game.type,
              url: Bastion.configurations.game.url && Bastion.configurations.game.url.trim().length ? Bastion.configurations.game.url : null
            });
        }
        catch (e) {
          Bastion.log.error(e);
        }
      }, ((typeof Bastion.configurations.game.interval === 'number' && Bastion.configurations.game.interval) || 60) * 60 * 1000);
    }

    let bastionGuilds = Bastion.guilds.map(g => g.id);
    let guilds = await Bastion.database.models.guild.findAll({
      attributes: [ 'guildID' ]
    });
    guilds = guilds.map(guild => guild.guildID);

    /*
     * Add guilds to the DB which was added Bastion when it was offline.
     */
    for (let i = 0; i < bastionGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guilds.length; j++) {
        if (bastionGuilds[i] === guilds[j]) {
          found = true;
          break;
        }
      }
      if (found === false) {
        /**
         * TODO: Use <Model>.bulkCreate() when Sequelize supports bulk ignore
         * option with it, which isn't supported yet because PostgreSQL doesn't
         * support 'INSERT OR IGNORE' query, yet.
         * @example
         * await Bastion.database.models.guild.bulkCreate(
         *   Bastion.guilds.map(guild => {
         *     return { guildID: guild.id };
         *   }),
         *   { ignore: true }
         * );
         */
        await Bastion.database.models.guild.create({
          guildID: bastionGuilds[i]
        },
        {
          fields: [ 'guildID' ]
        });
      }
    }

    /**
     * TODO: Remove guilds from DB which removed Bastion when it was offline.
     * @example
     * for (let i = 0; i < guilds.length; i++) {
     *   let found = false;
     *   for (let j = 0; j < bastionGuilds.length; j++) {
     *     if (guilds[i] === bastionGuilds[j]){
     *       found = true;
     *       break;
     *     }
     *   }
     *   if (found === false) {
     *     await Bastion.database.models.guild.destroy({
     *       where: {
     *         guildID: guilds[i]
     *       }
     *     });
     *   }
     * }
     */

    xrequire('./handlers/scheduledCommandHandler')(Bastion);
    xrequire('./handlers/streamNotifier')(Bastion);
    xrequire('./handlers/reactionRolesGroupsHandler')(Bastion);

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

      Bastion.log.console(COLOR`\n{cyan Bastion} v${Bastion.package.version}`);
      Bastion.log.console(COLOR`{gray ${Bastion.package.url}}`);

      Bastion.log.console(COLOR`\n{gray </> with ❤ by The Bastion Bot Team & Contributors}`);
      Bastion.log.console(COLOR`{gray Copyright (C) 2017-2018 The Bastion Bot Project}`);

      Bastion.log.console(COLOR`\n{cyan [${Bastion.user.username}]:} I'm ready to roll! 🚀\n`);

      if (Bastion.shard) {
        Bastion.log.console(COLOR`{green [   SHARDS]:} ${Bastion.shard.count}`);
      }
      Bastion.log.console(COLOR`{green [  SERVERS]:} ${guilds}`);
      Bastion.log.console(COLOR`{green [   PREFIX]:} ${Bastion.configurations.prefix.join(' ')}`);
      Bastion.log.console(COLOR`{green [ COMMANDS]:} ${Bastion.commands.size}`);

      Bastion.webhook.send('bastionLog', {
        color: Bastion.colors.BLUE,
        title: 'I\'m Ready to Roll!  🚀',
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
