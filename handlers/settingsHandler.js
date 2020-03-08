/**
 * @file settingsHandler
 * @author FellGill
 * @license GPL-3.0
 */

const fs = xrequire('fs');
const yaml = xrequire('yaml');

/* eslint-disable no-sync */
const configurationsFile = fs.readFileSync('./settings/configurations.yaml', 'utf8');
const credentialsFile = fs.readFileSync('./settings/credentials.yaml', 'utf8');
/* eslint-enable no-sync */
exports.configurations = yaml.parse(configurationsFile);
exports.credentials = yaml.parse(credentialsFile);