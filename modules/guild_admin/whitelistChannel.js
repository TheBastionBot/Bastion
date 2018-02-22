/**
 * @file whitelistChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.invites && !args.links && !args.words) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guild = await Bastion.db.get(`SELECT inviteFilterWhitelistChannels, linkFilterWhitelistChannels, wordFilterWhitelistChannels FROM whitelists WHERE guildID=${message.guild.id}`);

    let whitelistChannels, filter;
    if (args.invites) {
      filter = 'invite';

      if (guild && guild.inviteFilterWhitelistChannels) {
        whitelistChannels = guild.inviteFilterWhitelistChannels;
        whitelistChannels = whitelistChannels.split(' ');
      }
      else {
        whitelistChannels = [];
      }
    }
    else if (args.links) {
      filter = 'link';

      if (guild && guild.linkFilterWhitelistChannels) {
        whitelistChannels = guild.linkFilterWhitelistChannels;
        whitelistChannels = whitelistChannels.split(' ');
      }
      else {
        whitelistChannels = [];
      }
    }
    else if (args.words) {
      filter = 'word';

      if (guild && guild.wordFilterWhitelistChannels) {
        whitelistChannels = guild.wordFilterWhitelistChannels;
        whitelistChannels = whitelistChannels.split(' ');
      }
      else {
        whitelistChannels = [];
      }
    }

    let color = Bastion.colors.RED, description;
    if (whitelistChannels.includes(message.channel.id)) {
      if (args.remove) {
        whitelistChannels.splice(whitelistChannels.indexOf(message.channel.id), 1);
        color = Bastion.colors.GREEN;
        description = `This channel has been removed from the whitelist for ${filter} filter.`;
      }
      else {
        description = `This channel is already whitelisted for ${filter} filter.`;
      }
    }
    else {
      if (args.remove) {
        description = `This channel is already not whitelisted for ${filter} filter.`;
      }
      else {
        whitelistChannels.push(message.channel.id);
        color = Bastion.colors.GREEN;
        description = `This channel has been added to the whitelist for ${filter} filter.`;
      }
    }

    whitelistChannels = whitelistChannels.join(' ');

    if (guild) {
      if (args.invites) {
        await Bastion.db.run(`UPDATE whitelists SET inviteFilterWhitelistChannels='${whitelistChannels}' WHERE guildID='${message.guild.id}'`);
      }
      else if (args.links) {
        await Bastion.db.run(`UPDATE whitelists SET linkFilterWhitelistChannels='${whitelistChannels}' WHERE guildID='${message.guild.id}'`);
      }
      else if (args.words) {
        await Bastion.db.run(`UPDATE whitelists SET wordFilterWhitelistChannels='${whitelistChannels}' WHERE guildID='${message.guild.id}'`);
      }
    }
    else {
      if (args.invites) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, inviteFilterWhitelistChannels) VALUES('${message.guild.id}', '${whitelistChannels}')`);
      }
      else if (args.links) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, linkFilterWhitelistChannels) VALUES('${message.guild.id}', '${whitelistChannels}')`);
      }
      else if (args.words) {
        await Bastion.db.run(`INSERT OR REPLACE INTO whitelists(guildID, wordFilterWhitelistChannels) VALUES('${message.guild.id}', '${whitelistChannels}')`);
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
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'whitelistChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'whitelistChannel < --invites | --links | --words > [--remove]',
  example: [ 'whitelistChannel --links', 'whitelistChannel --links --remove' ]
};
