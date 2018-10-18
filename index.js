/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const fs = require('fs');
const YAML = require('yaml');

/* eslint-disable no-sync */
const configurationsFile = fs.readFileSync('./settings/configurations.yaml', 'utf8');
const credentialsFile = fs.readFileSync('./settings/credentials.yaml', 'utf8');
/* eslint-enable no-sync */
const configurations = YAML.parse(configurationsFile);
const credentials = YAML.parse(credentialsFile);

const Manager = new Tesseract.ShardingManager('./bastion.js', {
  totalShards: configurations.shardCount,
  token: credentials.token
});
const log = xrequire('./handlers/logHandler');

Manager.spawn();

Manager.on('launch', shard => {
  log.info(`Launching Shard ${shard.id} [ ${shard.id + 1} of ${Manager.totalShards} ]`);
});
