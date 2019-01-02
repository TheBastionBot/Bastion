/**
 * @file skip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (!message.guild.music.enabled) {
    if (Bastion.user.id === '267035345537728512') {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  if (message.guild.music.textChannelID && message.guild.music.textChannelID !== message.channel.id) {
    return Bastion.log.info('Music channels have been set, so music commands will only work in the Music Text Channel.');
  }

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notPlaying'), message.channel);
  }

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    if (!message.guild.music.skipVotes.includes(message.author.id)) {
      message.guild.music.skipVotes.push(message.author.id);
    }

    if (message.guild.music.skipVotes.length >= parseInt((message.guild.voiceConnection.channel.members.size - 1) / 2)) {
      await message.guild.music.dispatcher.end();

      await message.guild.music.textChannel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: 'Skipping current song.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await message.guild.music.textChannel.send({
        embed: {
          description: `${parseInt((message.guild.voiceConnection.channel.members.size - 1) / 2) - message.guild.music.skipVotes.length} votes required to skip the current song.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  else {
    await message.guild.music.dispatcher.end();

    await message.guild.music.textChannel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Skipping current song.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'skip',
  description: 'Skips the currently playing song, in your Discord server, and moves to the next one in the queue.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'skip',
  example: []
};
