/**
 * @file skip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('emptyQueue', 'errors'), string('notPlaying', 'errorMessage'), message.channel);
  }

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRoleID)) {
    if (!message.guild.music.skipVotes.includes(message.author.id)) {
      message.guild.music.skipVotes.push(message.author.id);
    }
    if (message.guild.music.skipVotes.length >= parseInt((message.guild.voiceConnection.channel/* voiceChannel */.members.size - 1) / 2)) {
      message.guild.music.textChannel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: 'Skipping current song.'
        }
      }).then(() => {
        message.guild.music.dispatcher.end();
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      message.guild.music.textChannel.send({
        embed: {
          description: `${parseInt((message.guild.voiceConnection.channel/* voiceChannel */.members.size - 1) / 2) - message.guild.music.skipVotes.length} votes required to skip the current song.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  else {
    message.guild.music.textChannel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Skipping current song.'
      }
    }).then(() => {
      message.guild.music.dispatcher.end();
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
  description: string('skip', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'skip',
  example: []
};
