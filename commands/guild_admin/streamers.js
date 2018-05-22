/**
 * @file streamers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let streamersModel = await Bastion.database.models.streamers.findOne({
      attributes: [ 'channelID', 'twitch' ],
      where: {
        guildID: message.guild.id
      }
    });

    let twitchStreamers = [], color, title, description;

    if (streamersModel && streamersModel.dataValues.twitch) {
      twitchStreamers = streamersModel.dataValues.twitch;
    }

    if (!args.streamers) {
      if (twitchStreamers.length) {
        color = Bastion.colors.BLUE;
        title = 'Followed streamers';
        description = twitchStreamers.join(', ');
      }
      else {
        color = Bastion.colors.RED;
        description = 'You\'re not following any streamers in this server.';
      }
    }
    else {
      if (args.remove) {
        color = Bastion.colors.RED;
        title = 'Removed from followed streamers';
        twitchStreamers = twitchStreamers.filter(streamer => args.streamers.indexOf(streamer) < 0);
      }
      else {
        color = Bastion.colors.GREEN;
        title = 'Added to followed streamers';
        twitchStreamers = twitchStreamers.concat(args.streamers);
      }
      description = args.streamers.join(' ');
      twitchStreamers = [ ...new Set(twitchStreamers) ];

      await Bastion.database.models.streamers.upsert({
        guildID: message.guild.id,
        channelID: message.channel.id,
        twitch: twitchStreamers
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'guildID', 'channelID', 'twitch' ]
      });
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
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
    { name: 'streamers', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamers',
  description: 'Adds/removes/displays the list of streamers followed by the server to get notified when they are live.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamers [user1 [user2]] [--remove]',
  example: [ 'streamers', 'streamers k3rn31p4nic Wipe Taafe', 'streamers k3rn31p4nic --remove' ]
};
