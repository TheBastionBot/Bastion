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
  setTimeout(async () => {
    try {
      let scheduledCommands = await Bastion.db.all('SELECT cronExp, command, channelID, messageID, arguments FROM scheduledCommands');

      if (scheduledCommands.length === 0) return;

      for (let i = 0; i < scheduledCommands.length; i++) {
        let cronExp = scheduledCommands[i].cronExp,
          command = scheduledCommands[i].command.toLowerCase(), cmd,
          channel = Bastion.channels.get(scheduledCommands[i].channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(Bastion, scheduledCommands[i].channelID);
          continue;
        }
        let args = scheduledCommands[i].arguments ? scheduledCommands[i].arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommands[i].messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(Bastion, scheduledCommands[i].messageID);
              }
              else {
                Bastion.log.error(e);
              }
            });

            if (Bastion.commands.has(command)) {
              cmd = Bastion.commands.get(command);
            }
            else if (Bastion.aliases.has(command)) {
              cmd = Bastion.commands.get(Bastion.aliases.get(command).toLowerCase());
            }
            else {
              job.stop();
              return removeScheduledCommandByCommandName(Bastion, command);
            }

            if (cmd.config.enabled) {
              cmd.exec(Bastion, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
            }
          },
          function () {},
          false // Start the job right now
        );
        job.start();
      }
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }, 5 * 1000);
};

/**
 * Removes Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @param {String} channelID The Snowflake ID of the channel where the command is scheduled
 * @returns {void}
 */
function removeScheduledCommandByChannelID(Bastion, channelID) {
  Bastion.db.run(`DELETE FROM scheduledCommands WHERE channelID='${channelID}'`).catch(e => {
    Bastion.log.error(e);
  });
}

/**
 * Removes Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @param {String} messageID The Snowflake ID of the message that holds the scheduled command's info
 * @returns {void}
 */
function removeScheduledCommandByMessageID(Bastion, messageID) {
  Bastion.db.run(`DELETE FROM scheduledCommands WHERE messageID='${messageID}'`).catch(e => {
    Bastion.log.error(e);
  });
}

/**
 * Removes Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @param {String} commandName The name of the command that is scheduled
 * @returns {void}
 */
function removeScheduledCommandByCommandName(Bastion, commandName) {
  Bastion.db.run(`DELETE FROM scheduledCommands WHERE command='${commandName}'`).catch(e => {
    Bastion.log.error(e);
  });
}
