/**
 * @file giveaway command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!('giveaways' in message.guild)) {
      message.guild.giveaways = new Map();
    }

    if (args.item) {
      // Giveaway item name
      args.item = args.item.join(' ');

      // Check if timeout is withing 24 hours
      if (args.timeout < 1 || args.timeout > 24) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), 'Giveaway can only run for at least an hour and at most 24 hours.', message.channel);
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
            text: `Giveaway ends in ${args.timeout} hours from now.`
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
            participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => `**${u.tag}** / ${u.id}`);
          }

          // Get random users (winners) from the participants
          let winners;
          if (participants.length) {
            winners = Bastion.functions.getRandomElements(participants, args.winners, true);
          }

          // If there're winners declare the result
          if (winners) {
            giveawayMessage.delete().catch(() => {});
            // Declare the result in the channel
            giveawayMessage.channel.send({
              embed: {
                color: Bastion.colors.BLUE,
                title: 'Giveaway Event Ended',
                description: `The following users have won **${args.item}**! And will be contacted by ${message.author.tag} with their reward.\nThank you everyone for participating. Better luck next time.`,
                fields: [
                  {
                    name: 'Winners',
                    value: winners.join('\n')
                  }
                ],
                footer: {
                  text: `Giveaway ID: ${giveawayMessageID}`
                }
              }
            }).catch(e => {
              if (e.code !== 50001) {
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
          message.guild.giveaways.delete(giveawayMessageID);
        }
        catch (e) {
          Bastion.log.error(e);
        }
      }, args.timeout * 60 * 60 * 1000);

      // Store the giveaway information in cache.
      message.guild.giveaways.set(giveawayMessageID, giveaway);
    }
    else if (args.end) {
      if (message.guild.giveaways.has(args.end)) {
        // Clear the giveaway timeout
        Bastion.clearTimeout(message.guild.giveaways.get(args.end));

        // Remove the giveaway details from cache
        message.guild.giveaways.delete(args.end);

        // Delete the giveaway message
        let giveawayMessage = await message.channel.fetchMessage(args.end);
        giveawayMessage.delete().catch(() => {});

        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Giveaway Cancelled',
            description: `The giveaway event with ID **${args.end}** has been cancelled by ${message.author.tag}`
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
    { name: 'winners', type: Number, alias: 'w', defaultValue: 1 },
    { name: 'end', type: String, alias: 'e' }
  ],
  ownerOnly: false
};

exports.help = {
  name: 'giveaway',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'giveaway < GIVEAWAY ITEM NAME [-t TIMEOUT_IN_HOURS] [--winners COUNT] | --end GIVEAWAY_MESSAGE_ID >',
  example: [ 'giveaway Awesome Goodies! -t 2', 'giveaway Bastion T-Shirt --winners 5', 'giveaway --end 153174267544338344' ]
};
