/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const fs = require('fs');
const YAML = require('yaml');
const util = xrequire('util');
const exec = util.promisify(xrequire('child_process').exec);
const log = xrequire('./handlers/logHandler');
const compareVersion = xrequire('./utils/compareVersion');

const { configurations, credentials } = xrequire('./handlers/settingsHandler');

log.info('Checking for updates...');

compareVersion().then(async res => {
  if (res === 1) {
    log.info('A new version of Bastion is avaiable.');
    if (configurations.autoUpdate) {
      const { stderr } = await exec('git pull', { timeout: 60000 });

      if (stderr) log.info('Unable to update. Please try updating manually.');
      else log.info('Successfully installed all updates.');
    }
  }
  else {
    log.info('Bastion is up to date.');
  }

  log.info('Starting Bastion...');


  const Manager = new Tesseract.ShardingManager('./bastion.js', {
    totalShards: configurations.shardCount,
    token: credentials.token
  });

  Manager.spawn();

  Manager.on('launch', shard => {
    log.info(`Launching Shard ${shard.id} [ ${shard.id + 1} of ${Manager.totalShards} ]`);
  });
}).catch(e => {
  log.error(`Unable to check for updates.\nMake sure you've an active internet connection.\n\n${e}`);
});
