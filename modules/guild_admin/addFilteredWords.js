/**
 * @file addFilteredWords command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userTextPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    let guildSettings = await Bastion.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`);

    let filteredWords = [];
    if (guildSettings.filteredWords) {
      filteredWords = guildSettings.filteredWords.split(' ');
    }
    filteredWords = filteredWords.concat(args);
    filteredWords = [ ...new Set(filteredWords) ];

    await Bastion.db.run(`UPDATE guildSettings SET filteredWords='${filteredWords.join(' ')}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added Words to Filter List',
        description: args.join(', ')
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'addfw' ],
  enabled: true
};

exports.help = {
  name: 'addFilteredWords',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'ADMINISTRATOR',
  usage: 'addFilteredWords word [anotherWord] [someOtherWord]',
  example: [ 'addFilteredWords cast creed race religion' ]
};
