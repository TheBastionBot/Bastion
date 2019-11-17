/**
 * @file setRateLimit command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let rateLimit = args.interval ? args.interval : 0;

  // Discord supports a cooldown of at most 6h.
  if (rateLimit > 21600) rateLimit = 21600;

  await message.channel.setRateLimitPerUser(rateLimit);

  await message.channel.send({
    embed: {
      color: rateLimit ? Bastion.colors.ORANGE : Bastion.colors.GREEN,
      title: rateLimit ? 'Slow Mode Enabled' : 'Slow Mode Disabled',
      description: `${message.author.tag} set the rate limit of this channel to ${rateLimit}s.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'interval', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'setRateLimit',
  description: 'Sets the rate limit for users in the text/news channel of your Discord server. Members will be restricted to sending one message per this interval, unless they have Manage Channel or Manage Messages permissions.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'setRateLimit [INTERVAL_IN_SECONDS]',
  example: [ 'setRateLimit', 'setRateLimit 60' ]
};
