/**
 * @file music command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.guildID) {
      args.guildID = message.guild.id;
    }

    let guildModels = await message.client.database.models.guild.findAll({
      attributes: [ 'guildID', 'music' ]
    });
    let guilds = guildModels.map(model => model.dataValues.guildID);

    if (!guilds.includes(args.guildID)) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'server'), message.channel);
    }

    let guild = guildModels.filter(model => model.dataValues.guildID === args.guildID);
    guild = guild[0];

    let musicStatus = !guild.dataValues.music;

    await message.client.database.models.guild.update({
      music: musicStatus
    },
    {
      where: {
        guildID: args.guildID
      },
      fields: [ 'music' ]
    });

    guild = Bastion.resolver.resolveGuild(guild.guildID);
    let guildDetails = guild ? `**${guild.name}** / ${args.guildID}` : `**${args.guildID}**`;

    message.channel.send({
      embed: {
        color: musicStatus ? Bastion.colors.GREEN : Bastion.colors.RED,
        description: `Music support has been ${musicStatus ? 'enabled' : 'disabled'} in the server ${guildDetails}`
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
    { name: 'guildID', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'music',
  description: 'Toggle music support for a specified server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'music <GUILD_ID>',
  example: [ 'music 441122339988775566' ]
};
