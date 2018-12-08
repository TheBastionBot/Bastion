/**
 * @file lyrics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!message.guild.music.enabled) {
    if (Bastion.user.id === '267035345537728512') {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  if (!args.song) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let response = await Bastion.methods.makeBWAPIRequest(`/song/${args.song.join(' ')}`);

  if (response.error) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Not Found',
        description: `No lyrics was found for **${args.song.join(' ').toTitleCase()}**.\nIf you think you are searching for the right song, try adding the artist's name to the search term and try again.`
      }
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: response.artist.name,
        icon_url: response.artist.image
      },
      title: response.name,
      description: response.lyrics.length > 2048
        ? `${response.lyrics.substring(0, 2045)}...`
        : response.lyrics,
      thumbnail: {
        url: response.image
      },
      footer: {
        text: 'Powered by Genius'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'lyrics',
  description: 'Shows the lyrics of the specified song.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lyrics <SONG NAME> [ARTIST NAME]',
  example: [ 'lyrics Something just like this', 'lyrics Shape of you - Ed Sheeran' ]
};
