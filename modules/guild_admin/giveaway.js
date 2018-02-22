/**
 * @file giveaway command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let giveaways = new Map();

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.item) {
      // Allow only one giveaway event per server
      if (giveaways.has(message.guild.id)) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isEventInUse', true, 'giveaway'), message.channel);
      }

      // Giveaway item name
      args.item = args.item.join(' ');

      // Check if timeout is withing 12 hours
      if (args.timeout < 1 || args.timeout > 12) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), 'Giveaway can only run for at least an hour and at most 12 hours.', message.channel);
      }

      // Generate a random reaction for the giveaway message
      let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🔮', '🎀', '🎐', '🏮' ];
      reaction = reaction[Math.floor(Math.random() * reaction.length)];

      // Send the giveaway message and add the reaction to it
      let giveawayMessage = await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: '🎉 GIVEAWAY! 🎉',
          description: `Giveaway event started. React to this message with ${reaction} to get a chance to win **${args.item}**.`,
          footer: {
            text: `Giveaway ID: ${message.guild.id} • Giveaway ends in ${args.timeout} hours from now.`
          }
        }
      });
      await giveawayMessage.react(reaction);

      // Giveaway message details
      let giveawayMessageID = giveawayMessage.id;

      // Start giveaway timeout
      let giveaway = Bastion.setTimeout(async () => {
        try {
          // Fetch the giveaway message to get new reactions
          giveawayMessage = await message.channel.fetchMessage(giveawayMessageID);

          // Get (only) the users who reacted to the giveaway message
          let participants;
          if (giveawayMessage.reactions.has(reaction)) {
            participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => u.id);
          }

          // Get a random user (winner) from the participants
          let winner;
          while (!winner && participants.length) {
            winner = participants[Math.floor(Math.random() * participants.length)];
            participants.splice(participants.indexOf(winner), 1);
            winner = await Bastion.fetchUser(winner).catch(() => {});
          }

          // If there's a winner declare the result
          if (winner) {
            // Declare the result in the channel
            giveawayMessage.edit({
              embed: {
                color: Bastion.colors.BLUE,
                title: 'Giveaway Event Ended',
                description: `${winner} won **${args.item}**! And will be contacted by ${message.author.tag} with their reward.\nThank you everyone for participating. Better luck next time.`,
                footer: {
                  text: `Giveaway ID: ${message.guild.id}`
                }
              }
            }).catch(e => {
              if (e.code !== 50001) {
                Bastion.log.error(e);
              }
            });

            // Let the winner know via DM
            winner.send({
              embed: {
                color: Bastion.colors.BLUE,
                title: 'Congratulations',
                description: `You won the **${args.item}** in a giveaway you participated in **${message.guild.name}** Server!\nYou'll soon be contacted by ${message.author.tag} with your reward.`
              }
            }).catch(e => {
              if (e.code !== 50007) {
                Bastion.log.error(e);
              }
            });
          }
          // Otherwise state the unfortunate outcome
          else {
            giveawayMessage.edit({
              embed: {
                color: Bastion.colors.RED,
                title: 'Giveaway Event Ended',
                description: `Unfortunately, no one participated and apparently there's no winner for **${args.item}**. 😕`,
                footer: {
                  text: `Giveaway ID: ${message.guild.id}`
                }
              }
            }).catch(e => {
              if (e.code !== 50001) {
                Bastion.log.error(e);
              }
            });
          }

          // Remove the giveaway details from cache
          giveaways.delete(message.guild.id);
        }
        catch (e) {
          Bastion.log.error(e);
        }
      }, args.timeout * 60 * 60 * 1000);

      // Store the giveaway information in cache.
      giveaways.set(message.guild.id, giveaway);
    }
    else if (args.end) {
      if (giveaways.has(message.guild.id)) {
        // Clear the giveaway timeout
        Bastion.clearTimeout(giveaways.get(message.guild.id));

        // Remove the giveaway details from cache
        giveaways.delete(message.guild.id);

        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Giveaway Cancelled',
            description: `The giveaway event with ID **${message.guild.id}** has been cancelled by ${message.author.tag}`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      else {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), 'There\'s no giveaway running in this server right now.', message.channel);
      }
    }
    else {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'item', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 3 },
    { name: 'end', type: Boolean }
  ],
  ownerOnly: false
};

exports.help = {
  name: 'giveaway',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'giveaway < GIVEAWAY ITEM NAME | --end > [-t TIMEOUT_IN_HOURS]',
  example: [ 'giveaway Awesome Goodies! -t 2', 'giveaway --end' ]
};
