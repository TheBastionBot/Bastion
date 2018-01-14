/**
 * @file musicChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let musicTextChannel, musicVoiceChannel, color, description, fields;

    if (args.remove) {
      await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=null, musicVoiceChannel=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      description = 'Default music channels have been removed.';
    }
    else if (args.id) {
      musicTextChannel = message.channel;
      musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(args.id);
      if (musicVoiceChannel) {
        await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=${musicTextChannel.id}, musicVoiceChannel=${musicVoiceChannel.id} WHERE guildID=${message.guild.id}`);
        color = Bastion.colors.GREEN;
        fields = [
          {
            name: 'Music Text Channel',
            value: `${musicTextChannel} is now set as the default text channel for music.`
          },
          {
            name: 'Music Voice Channel',
            value: `**${musicVoiceChannel.name}** is now set as the default voice channel for music.`
          }
        ];
      }
      else {
        color = Bastion.colors.RED;
        description = 'Invalid voice channel ID for music channel.';
      }
    }
    else {
      if (message.guild.music.textChannelID) {
        musicTextChannel = message.guild.channels.filter(c => c.type === 'text').get(message.guild.music.textChannelID);
      }
      if (message.guild.music.voiceChannelID) {
        musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
      }

      if (!musicTextChannel || !musicVoiceChannel) {
        color = Bastion.colors.RED;
        description = 'Music channels have not been set.';
      }
      else {
        color = Bastion.colors.BLUE;
        fields = [
          {
            name: 'Music Text Channel',
            value: `${musicTextChannel} is the default text channel for music.`
          },
          {
            name: 'Music Voice Channel',
            value: `**${musicVoiceChannel.name}** is the default voice channel for music.`
          }
        ];
      }
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Music Channel',
        description: description,
        fields: fields
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
    { name: 'id', type: String, defaultOption: true },
    { name: 'remove', alias: 'r', type: Boolean }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'musicChannel',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'musicChannel [VOICE_CHANNEL_ID] [--remove]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel', 'musicChannel --remove' ]
};
