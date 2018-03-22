/**
 * @file whitelistRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id || (!args.invites && !args.links && !args.words)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let role = message.guild.roles.get(args.id);
    if (!role) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let guild = await Bastion.db.get(`SELECT inviteFilterWhitelistRoles, linkFilterWhitelistRoles, wordFilterWhitelistRoles FROM whitelists WHERE guildID=${message.guild.id}`);

    let whitelistRoles, filter;
    if (args.invites) {
      filter = 'invite';

      if (guild && guild.inviteFilterWhitelistRoles) {
        whitelistRoles = guild.inviteFilterWhitelistRoles;
        whitelistRoles = whitelistRoles.split(' ');
      }
      else {
        whitelistRoles = [];
      }
    }
    else if (args.links) {
      filter = 'link';

      if (guild && guild.linkFilterWhitelistRoles) {
        whitelistRoles = guild.linkFilterWhitelistRoles;
        whitelistRoles = whitelistRoles.split(' ');
      }
      else {
        whitelistRoles = [];
      }
    }
    else if (args.words) {
      filter = 'word';

      if (guild && guild.wordFilterWhitelistRoles) {
        whitelistRoles = guild.wordFilterWhitelistRoles;
        whitelistRoles = whitelistRoles.split(' ');
      }
      else {
        whitelistRoles = [];
      }
    }

    let color = Bastion.colors.RED, description;
    if (whitelistRoles.includes(args.id)) {
      if (args.remove) {
        whitelistRoles.splice(whitelistRoles.indexOf(args.id), 1);
        color = Bastion.colors.GREEN;
        description = `${role.name} role has been removed from the whitelist for ${filter} filter.`;
      }
      else {
        description = `${role.name} role is already whitelisted for ${filter} filter.`;
      }
    }
    else {
      if (args.remove) {
        description = `${role.name} role is already not whitelisted for ${filter} filter.`;
      }
      else {
        whitelistRoles.push(args.id);
        color = Bastion.colors.GREEN;
        description = `${role.name} role has been added to the whitelist for ${filter} filter.`;
      }
    }

    whitelistRoles = whitelistRoles.join(' ');

    if (guild) {
      if (args.invites) {
        await Bastion.db.run(`UPDATE whitelists SET inviteFilterWhitelistRoles='${whitelistRoles}' WHERE guildID='${message.guild.id}'`);
      }
      else if (args.links) {
        await Bastion.db.run(`UPDATE whitelists SET linkFilterWhitelistRoles='${whitelistRoles}' WHERE guildID='${message.guild.id}'`);
      }
      else if (args.words) {
        await Bastion.db.run(`UPDATE whitelists SET wordFilterWhitelistRoles='${whitelistRoles}' WHERE guildID='${message.guild.id}'`);
      }
    }
    else {
      if (args.invites) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, inviteFilterWhitelistRoles) VALUES('${message.guild.id}', '${whitelistRoles}')`);
      }
      else if (args.links) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, linkFilterWhitelistRoles) VALUES('${message.guild.id}', '${whitelistRoles}')`);
      }
      else if (args.words) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, wordFilterWhitelistRoles) VALUES('${message.guild.id}', '${whitelistRoles}')`);
      }
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'invites', type: Boolean, alias: 'i' },
    { name: 'links', type: Boolean, alias: 'l' },
    { name: 'words', type: Boolean, alias: 'w' },
    { name: 'id', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'whitelistRole',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'whitelistRole <ROLE_ID> < --invites | --links | --words > [--remove]',
  example: [ 'whitelistRole 295982817647788032 --invites', 'whitelistRole 295982817647788032 --invites --remove' ]
};
