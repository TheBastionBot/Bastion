/**
 * @file scheduledCommandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CronJob = require('cron').CronJob;
const parseArgs = require('command-line-args');

/**
 * Handles Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @returns {void}
 */
module.exports = Bastion => {
  setTimeout(() => {
    Bastion.db.all('SELECT cronExp, command, channelID, messageID, arguments FROM scheduledCommands').then(scheduledCommands => {
      if (scheduledCommands.length === 0) return;

      for (let i = 0; i < scheduledCommands.length; i++) {
        let cronExp = scheduledCommands[i].cronExp,
          command = scheduledCommands[i].command, cmd,
          channel = Bastion.channels.get(scheduledCommands[i].channelID);
        if (!channel) return;
        let args = scheduledCommands[i].arguments ? scheduledCommands[i].arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          function () {
            channel.fetchMessage(scheduledCommands[i].messageID).then(message => {
              if (Bastion.commands.has(command)) {
                cmd = Bastion.commands.get(command);
              }
              else if (Bastion.aliases.has(command)) {
                cmd = Bastion.commands.get(Bastion.aliases.get(command));
              }
              else return job.stop();

              if (cmd.config.enabled) {
                cmd.run(Bastion, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
              }
            }).catch(e => {
              Bastion.log.error(e);
            });
          },
          function () {
            // This function is executed when the job stops
          },
          false // Start the job right now
        );
        job.start();
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }, 5 * 1000);
};
