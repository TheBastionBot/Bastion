/**
 * @file scheduledCommandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const CronJob = xrequire('cron').CronJob;
const parseArgs = xrequire('command-line-args');

/**
 * Handles Bastion's scheduled commands
 * @param {Bastion} Bastion Bastion Discord client object
 * @returns {void}
 */
module.exports = Bastion => {
  setTimeout(async () => {
    try {
      let scheduledCommandModel = await Bastion.database.models.scheduledCommand.findAll({
        attributes: [ 'channelID', 'messageID', 'cronExp', 'command', 'arguments' ]
      });

      if (!scheduledCommandModel.length) return;

      for (let i = 0; i < scheduledCommandModel.length; i++) {
        let cronExp = scheduledCommandModel[i].dataValues.cronExp,
          command = scheduledCommandModel[i].dataValues.command.toLowerCase(), cmd,
          channel = Bastion.channels.get(scheduledCommandModel[i].dataValues.channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(Bastion, scheduledCommandModel[i].dataValues.channelID);
          continue;
        }
        let args = scheduledCommandModel[i].dataValues.arguments ? scheduledCommandModel[i].dataValues.arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommandModel[i].dataValues.messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(Bastion, scheduledCommandModel[i].dataValues.messageID);
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
  Bastion.database.models.scheduledCommand.destroy({
    where: {
      channelID: channelID
    }
  }).catch(e => {
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
  Bastion.database.models.scheduledCommand.destroy({
    where: {
      messageID: messageID
    }
  }).catch(e => {
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
  Bastion.database.models.scheduledCommand.destroy({
    where: {
      command: commandName
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
}
