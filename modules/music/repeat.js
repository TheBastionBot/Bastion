/**
 * @file repeat command
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

  let color, repeatStat = '';
  if (message.guild.music.repeat) {
    color = Bastion.colors.RED;
    message.guild.music.repeat = false;
    repeatStat = 'Removed the current song from repeat queue.';
  }
  else {
    color = Bastion.colors.GREEN;
    message.guild.music.repeat = true;
    repeatStat = 'Added the current song to the repeat queue.';
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: repeatStat
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'repeat',
  description: string('repeat', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'repeat',
  example: []
};
