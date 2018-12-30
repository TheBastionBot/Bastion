/**
 * @file wow command
 * @author James Naylor (a.k.a euronay)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.character || !args.realm) {
      return Bastion.emit('commandUsage', message, this.help);
    }

    let profile = await Bastion.methods.makeBWAPIRequest(`/gamestats/wow/${args.region}/${args.realm}/${args.character}`);

    let stats = [
      {
        name: 'Character',
        value: `${profile.level} - ${profile.race} - ${profile.class}`
      },
      {
        name: 'Achievement Points',
        value: profile.achievementPoints,
        inline: true
      },
      {
        name: 'Item Level',
        value: profile.items.averageItemLevel,
        inline: true
      }
    ];

    if (profile.guild) {
      stats.push(
        {
          name: 'Guild',
          value: profile.guild.name,
          inline: true
        }
      );
    }

    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: profile.name,
          url: `https://worldofwarcraft.com/${args.region.toLowerCase() === 'us' ? 'en-us' : 'en-gb'}/character/${args.realm}/${args.character}`,
          icon_url: profile.factionIcon
        },
        fields: stats,
        thumbnail: {
          url: profile.thumbnail
        },
        footer: {
          text: 'Powered by Blizzard'
        }
      }
    });
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      if (e.statusCode === '404') {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'player'), message.channel);
      }
    }
    throw e;
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'character', type: String, defaultOption: true },
    { name: 'realm', type: String, alias: 'r' },
    { name: 'region', type: String, defaultValue: 'us' }
  ]
};

exports.help = {
  name: 'wow',
  description: 'Get stats of any World of Warcraft character from the Armory.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wow <CHARACTER> <--realm REALM> [--region REGION]',
  example: [
    'wow Fallken --realm Burning-Blade --region EU'
  ]
};
