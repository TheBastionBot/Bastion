/**
 * @file animoji command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let emoji = message.guild.emojis.find('name', args.name);

  if (emoji) {
    message.channel.send({
      files: [ emoji.url ]
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'animote' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'animoji',
  description: 'Sends a large version of the specified animated emoji of your Discord server. And Nitro isn\'t required.',
  botPermission: '',
  userTextPermission: 'ADD_REACTIONS',
  userVoicePermission: '',
  usage: 'animoji <ANIMATED_EMOJI_NAME>',
  example: [ 'animoji PartyWumpus' ]
};
