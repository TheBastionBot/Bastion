/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const sql = require('sqlite');
const yt = require('youtube-dl');
sql.open('./data/Bastion.sqlite');
let queue = {};

exports.run = function(Bastion, message, args) {
  // TODO: Auto pause/resume playback
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
  if (args.length < 1) return;
  sql.get(`SELECT musicTextChannelID, musicVoiceChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(musicChannel => {
    if (message.guild.voiceConnection) {
      voiceChannel = message.guild.voiceConnection.channel;
      textChannel = message.channel;
      vcStats = 'You need to be in the same voice channel as the BOT to be able to use music commands.';
    }
    else if (musicChannel.musicTextChannelID && musicChannel.musicVoiceChannelID) {
      if (!(voiceChannel = message.guild.channels.filter(c => c.type == 'voice').get(musicChannel.musicVoiceChannelID)) || !(textChannel = message.guild.channels.filter(c => c.type == 'text').get(musicChannel.musicTextChannelID))) return message.channel.sendMessage('', {embed: {
        color: 13380644,
        description: 'Invalid Text/Voice Channel ID has been added to default music channel.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
      vcStats = `You need to be in the default music channel (**${voiceChannel.name}**) of the BOT to be able to use music commands.`;
    }
    else return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'No default music channel has been set. And I need to be in a voice channel to be able to play music.'
    }}).then(m => {
      m.delete(30000);
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
    if (textChannel != message.channel) return;
    if (voiceChannel.members.get(message.author.id) == undefined) return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: vcStats
    }}).then(m => {
      m.delete(30000);
    }).catch(e => {
      Bastion.log.error(e.stack);
    });

    args = /^((https:\/\/)(www\.)?(youtube\.com)\/watch\?v=[a-zA-Z0-9-_]{11})$/i.test(args[0]) ? args[0] : 'ytsearch:' + args.join(' ');
    yt.getInfo(args, ['-q', '--no-warnings', '--force-ipv4', '--format=bestvideo[height<=480]+bestaudio/best[height<=480]'], (err, info) => {
      if(err || info.format_id === undefined || info.format_id.startsWith('0')) return console.log(err);
      if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
      queue[message.guild.id].songs.push({
        url: info.formats[0].url,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        requester: message.author.id
      });
      textChannel.sendMessage('', {embed: {
        color: 5088314,
        title: 'Added to the queue',
        description: info.title,
        thumbnail: {
          url: info.thumbnail
        },
        footer: {
          text: `Position: ${queue[message.guild.id].songs.length} | Duration: ${info.duration} | Requester: ${message.author.username}#${message.author.discriminator}`
        }
      }}).then(m => {
        m.delete(30000);
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
      if (queue.hasOwnProperty(message.guild.id) && (queue[message.guild.id].playing == true)) return;

      if (!message.guild.voiceConnection) {
        voiceChannel.join().then(connection => {
          (function play(song) {
            if (song === undefined) return textChannel.sendMessage('', {embed: {
              color: 13380644,
              description: 'Exiting voice channel.'
            }}).then(m => {
              queue[message.guild.id].playing = false;
              voiceChannel.leave();
              m.delete(10000);
            }).catch(e => {
              Bastion.log.error(e.stack);
            });
            dispatcher = message.guild.voiceConnection.playStream(yt(song.url), { passes: 1 });
            queue[message.guild.id].playing = true;
            textChannel.sendMessage('', {embed: {
              color: 5088314,
              title: 'Playing',
              description: song.title,
              thumbnail: {
                url: song.thumbnail
              },
              footer: {
                text: `🔉 ${dispatcher.volume*50}% | Duration: ${info.duration} | Requester: ${message.author.username}#${message.author.discriminator}`
              }
            }}).then(m => {
              m.delete(30000);
            }).catch(e => {
              Bastion.log.error(e.stack);
            });

            let collector = textChannel.createCollector(
              msg => msg.content.startsWith(`${Bastion.config.prefix}pause`) || msg.content.startsWith(`${Bastion.config.prefix}resume`) || msg.content.startsWith(`${Bastion.config.prefix}skip`) || msg.content.startsWith(`${Bastion.config.prefix}stop`) || msg.content.startsWith(`${Bastion.config.prefix}volume`) || msg.content.startsWith(`${Bastion.config.prefix}np`) || msg.content.startsWith(`${Bastion.config.prefix}queue`)
            );
            collector.on('message', msg => {
              if (msg.content.startsWith(`${Bastion.config.prefix}pause`)) {
                if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
                if (!message.guild.voiceConnection.speaking) return;
                textChannel.sendMessage('', {embed: {
                  color: 15451167,
                  title: 'Paused Playback',
                  description: song.title,
                  footer: {
                    text: `🔉 ${dispatcher.volume*50}% | ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} / ${info.duration}`
                  }
                }}).then(m => {
                  dispatcher.pause();
                  m.delete(30000);
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}resume`)) {
                if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
                if (message.guild.voiceConnection.speaking) return;
                textChannel.sendMessage('', {embed: {
                  color: 5088314,
                  title: 'Resumed Playback',
                  description: song.title,
                  footer: {
                    text: `🔉 ${dispatcher.volume*50}% | ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} / ${info.duration}`
                  }
                }}).then(m => {
                  dispatcher.resume();
                  m.delete(30000);
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}skip`)) {
                if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
                textChannel.sendMessage('', {embed: {
                  color: 14845440,
                  description: 'Skipping current song.'
                }}).then(m => {
                  dispatcher.end();
                  m.delete(10000);
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}stop`)) {
                if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
                textChannel.sendMessage('', {embed: {
                  color: 13380644,
                  description: 'Stopped Playback.'
                }}).then(m => {
                  if (queue.hasOwnProperty(message.guild.id)) queue[message.guild.id].songs = [];
                  voiceChannel.leave();
                  m.delete(10000);
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}volume`)) {
                if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
                param = msg.content.split(' ').slice(1);
                if (param[0] == '+')
                  dispatcher.setVolume((dispatcher.volume*50 + 2)/50);
                else if (param[0] == '-')
                  dispatcher.setVolume((dispatcher.volume*50 - 2)/50);
                else if (/^\d+$/.test(param[0])) {
                  param = param[0] > 0 && param[0] < 100 ? param[0] : 100;
                  dispatcher.setVolume(param/50);
                }
                textChannel.sendMessage('', {embed: {
                  color: 5088314,
                  description: `Volume: ${Math.round(dispatcher.volume*50)}%`
                }}).then(m => {
                  m.delete(10000)
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}np`)) {
                textChannel.sendMessage('', {embed: {
                  color: 5088314,
                  title: 'Now Playing',
                  description: song.title,
                  thumbnail: {
                    url: song.thumbnail
                  },
                  footer: {
                    text: `🔉 ${dispatcher.volume*50}% | ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} / ${info.duration}`
                  }
                }}).then(m => {
                  m.delete(30000)
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
              else if (msg.content.startsWith(`${Bastion.config.prefix}queue`)) {
                let fields = [];
                for (var i = 1; i < (queue[message.guild.id].songs.length <= 25 ? queue[message.guild.id].songs.length : 25); i++)
                  fields.push({
                    name: `${i  }. ${queue[message.guild.id].songs[i].title}`,
                    value: `**Duration:** ${queue[message.guild.id].songs[i].duration}\t**Requester:** <@${queue[message.guild.id].songs[i].requester}>`
                  });
                textChannel.sendMessage('', {embed: {
                  color: 5088314,
                  title: 'Music queue',
                  description: `${(queue[message.guild.id].songs.length <= 25 ? queue[message.guild.id].songs.length : 25)-1} songs in current queue`,
                  fields: fields,
                  footer: {
                    text: `Total no. of songs in queue: ${queue[message.guild.id].songs.length-1}`
                  }
                }}).then(m => {
                  m.delete(60000);
                }).catch(e => {
                  Bastion.log.error(e.stack);
                });
              }
            });
            dispatcher.on('end', () => {
              collector.stop();
              queue[message.guild.id].songs.shift();
              play(queue[message.guild.id].songs[0]);
            });
            dispatcher.on('error', (err) => {
              collector.stop();
              queue[message.guild.id].songs.shift();
              play(queue[message.guild.id].songs[0]);
              return Bastion.log.error(err);
            });
          }(queue[message.guild.id].songs[0]));
        });
      }
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'play',
  description: 'Adds a song to the queue by youtube video link, or adds the first youtube result for the provided search text.',
  permission: '',
  usage: ['play song name', 'play youtube_video_link']
};
