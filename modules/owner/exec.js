/**
 * @file exec command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.length) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    args = args.join(' ');

    let { stdout, stderr } = await exec(args, { timeout: 60 * 1000 });

    let output = [
      {
        name: ':inbox_tray: INPUT',
        value: `\`\`\`bash\n${args}\`\`\``
      }
    ];
    let color;

    if (stdout) {
      color = Bastion.colors.GREEN;
      output.push({
        name: ':outbox_tray: OUTPUT',
        value: `\`\`\`bash\n${sanitize(stdout)}\`\`\``
      });
    }
    else if (stderr) {
      color = Bastion.colors.RED;
      output.push({
        name: ':no_entry: ERROR',
        value: `\`\`\`bash\n${sanitize(stdout)}\`\`\``
      });
    }
    else {
      color = Bastion.colors.GREEN;
      output.push({
        name: ':outbox_tray: OUTPUT',
        value: '```bash\n# Command executed successfully but returned no output.```'
      });
    }

    message.channel.send({
      embed: {
        color: color,
        fields: output
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.cmd) {
      let output = [
        {
          name: ':inbox_tray: INPUT',
          value: `\`\`\`bash\n${args}\`\`\``
        }
      ];
      let color;

      if (e.stdout) {
        color = Bastion.colors.GREEN;
        output.push({
          name: ':outbox_tray: OUTPUT',
          value: `\`\`\`bash\n${sanitize(e.stdout)}\`\`\``
        });
      }
      else if (e.stderr) {
        color = Bastion.colors.RED;
        output.push({
          name: ':no_entry: ERROR',
          value: `\`\`\`bash\n${sanitize(e.stderr)}\`\`\``
        });
      }
      else {
        color = Bastion.colors.RED;
        output.push({
          name: ':outbox_tray: OUTPUT',
          value: '```bash\n# Command was terminated after running for 1 minute and returned no output.```'
        });
      }

      message.channel.send({
        embed: {
          color: color,
          fields: output
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: null,
  ownerOnly: true
};

exports.help = {
  name: 'exec',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'exec <command>',
  example: [ 'exec ls -l', 'exec DIR /B' ]
};


/**
 * Limits the string length to 1000 characters
 * @function sanitize
 * @param {string} text The stdout/stderr output
 * @returns {string} Trimmed stdout/stderr string
 */
function sanitize(text) {
  text = text.toString();
  return text.substring(0, 1000);
}
