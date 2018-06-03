/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Discord = xrequire('discord.js');
const credentials = xrequire('./settings/credentials.json');
const config = xrequire('./settings/config.json');
const Manager = new Discord.ShardingManager('./bastion.js', {
  totalShards: config.shardCount,
  token: credentials.token
});
const log = xrequire('./handlers/logHandler');

Manager.spawn();

Manager.on('launch', shard => {
  log.info(`Launching Shard ${shard.id} [ ${shard.id + 1} of ${Manager.totalShards} ]`);
});
