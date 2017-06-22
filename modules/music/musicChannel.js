/**
 * @file musicChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!(parseInt(args[0]) < 9223372036854775807)) {
    Bastion.db.run(`UPDATE guildSettings SET musicTextChannelID=null, musicVoiceChannelID=null WHERE guildID=${message.guild.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Default music channel removed.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    Bastion.db.run(`UPDATE guildSettings SET musicTextChannelID=${message.channel.id}, musicVoiceChannelID=${args[0]} WHERE guildID=${message.guild.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Default music channel set',
          fields: [
            {
              name: 'Text channel for music commands',
              value: `<#${message.channel.id}>`
            },
            {
              name: 'Music channel',
              value: message.guild.channels.filter(c => c.type === 'voice').get(args[0]) ? message.guild.channels.filter(c => c.type === 'voice').get(args[0]).name : 'Invalid'
            }
          ]
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'musicchannel',
  description: 'Adds a voice channel (by ID) & text channel (the channel this command was used) specific for the music module. i.e, BOT will only accept music commands in that text channel & if any one summons the bot it will automatically join the specified voice channel. If channel ID is not given, it removes the default music channel.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'musicChannel [VOICE_CHANNEL_ID]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel' ]
};
