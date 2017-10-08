/**
 * @file streamNotifier
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
*/

const CronJob = require('cron').CronJob;
const request = require('request');

/**
 * Handles Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @returns {void}
 */
module.exports = Bastion => {
  try {
    let job = new CronJob('* * * * * *',
      async () => {
        try {
          for (let guild of Bastion.guilds) {
            guild = guild[1];
            let streamers = await Bastion.db.get(`SELECT * FROM streamers WHERE guildID=${guild.id}`);
            if (!streamers || !streamers.channelID) return;
            let twitchStreamers = streamers.twitch.split(' ');

            request({
              headers: {
                'Client-ID': Bastion.credentials.twitchClientID,
                'Accept': 'Accept: application/vnd.twitchtv.v3+json'
              },
              uri: `https://api.twitch.tv/kraken/streams/?channel=${twitchStreamers.join(',')}`
            }, async (error, response, body) => {
              try {
                if (error) {
                  Bastion.log.error(error);
                }
                else if (response) {
                  if (response.statusCode === 200) {
                    body = JSON.parse(body);
                    if (body._total > 0 && body.streams.length > 0) {
                      let streams = body.streams;

                      /*
                       * For the first run, when there no known live streamers.
                       */
                      if (!guild.lastStreamers) {
                        /*
                         * Add the streamers currently live to `lastStreamers`,
                         * so that the notification doesn't gets triggered as
                         * soon as Bastion gets online.
                         */
                        guild.lastStreamers = streams.map(stream => stream._id);
                      }
                      /*
                       * For the rest of the iteration, where there might or
                       * might not be any known live streamers.
                       */
                      else {
                        /*
                         * If any live streamers (`lastStreamers`) have
                         * stopped streaming, remove them from `lastStreamers`.
                         */
                        guild.lastStreamers.forEach(stream => {
                          if (!streams.map(stream => stream._id).includes(stream)) {
                            guild.lastStreamers.splice(guild.lastStreamers.indexOf(stream), 1);
                          }
                        });
                      }

                      for (let stream of streams) {
                        /*
                         * If the (recently fetched) live streamer is not
                         * known, i.e. stored in `lastStreamers`, add them.
                         * And notify in the specified channel that the
                         * streamer is live.
                         */
                        if (!guild.lastStreamers.includes(stream._id)) {
                          await Bastion.channels.get(streamers.channel).send({
                            embed: {
                              color: Bastion.colors.PURPLE,
                              author: {
                                name: stream.channel.display_name,
                                url: stream.channel.url,
                                icon_url: stream.channel.logo
                              },
                              title: stream.channel.status,
                              url: stream.channel.url,
                              description: `${stream.display_name} is now live!`,
                              fields: [
                                {
                                  name: 'Game',
                                  value: body.stream.game,
                                  inline: true
                                },
                                {
                                  name: 'Viewers',
                                  value: body.stream.viewers,
                                  inline: true
                                }
                              ],
                              image: {
                                url: stream.preview.large
                              },
                              timestamp: new Date(stream.created_at)
                            }
                          });
                          guild.lastStreamers.push(stream._id);
                        }
                      }
                    }
                  }
                  else {
                    return Bastion.log.error(`Unable to fetch stream details.\n${response.statusCode}: ${response.statusMessage}`);
                  }
                }
              }
              catch (e) {
                Bastion.log.error(e);
              }
            });
          }
        }
        catch (e) {
          Bastion.log.error(e);
        }
      },
      () => {},
      false
    );
    job.start();
  }
  catch (e) {
    Bastion.log.error(e);
  }
};
