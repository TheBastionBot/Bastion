/**
 * @file guildCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = guild => {
  /**
   * TODO: Use <Model>.create() when Sequelize supports ignore option with it,
   * which isn't supported yet because PostgreSQL doesn't support
   * 'INSERT OR IGNORE' query, yet.
   * @example
   * await guild.client.database.models.guild.create({
   *   where: {
   *     guildID: guild.id;
   *   },
   *   ignore: true
   * });
   */
  /**
   * Using <Model>.findOrCreate() won't require the use of
   * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
   * <Model>.findOrCreate() creates a race condition where a matching row is
   * created by another connection after the `find` but before the `insert`
   * call. However, it is not always possible to handle this case in SQLite,
   * specifically if one transaction inserts and another tries to select
   * before the first one has committed. TimeoutError is thrown instead.
   */
  guild.client.database.models.guild.findOrBuild({
    where: {
      guildID: guild.id
    }
  }).spread((guildModel, initialized) => {
    if (initialized) {
      return guildModel.save();
    }
  }).catch(e => {
    guild.client.log.error(e);
  });

  guild.client.webhook.send('bastionLog', {
    color: guild.client.colors.GREEN,
    title: guild.client.i18n.event(guild.language, 'guildCreate'),
    fields: [
      {
        name: 'Server Name',
        value: guild.name,
        inline: true
      },
      {
        name: 'Server ID',
        value: guild.id,
        inline: true
      },
      {
        name: 'Server Owner',
        value: guild.owner ? guild.owner.user.tag : 'Unknown',
        inline: true
      },
      {
        name: 'Server Owner ID',
        value: guild.ownerID,
        inline: true
      }
    ],
    thumbnail: {
      url: guild.icon ? guild.iconURL : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(guild.nameAcronym)}`
    },
    timestamp: new Date()
  });
};
