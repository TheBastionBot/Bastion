/**
 * @file Method Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');

let methodDir = './methods/';
// eslint-disable-next-line no-sync
let functions = fs.readdirSync(methodDir);
for (let method of functions) {
  exports[method.replace('.js', '')] = xrequire(methodDir, method);
}
