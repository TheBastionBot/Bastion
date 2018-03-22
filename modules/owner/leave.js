/**
 * @file leave command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guild, found = true;
    if (Bastion.shard) {
      guild = await Bastion.shard.broadcastEval(`this.guilds.get('${args[0]}') && this.guilds.get('${args[0]}').leave().catch(e => this.log.error(e))`);
      guild = guild.filter(g => g);
      if (!guild.length) {
        found = false;
      }
    }
    else {
      guild = Bastion.guilds.get(args[0]);
      if (!guild) {
        found = false;
      }
      await guild.leave();
    }

    if (found) {
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `I've left the${Bastion.shard ? ' ' : ` **${guild.name}** `}Discord server with the ID **${args[0]}**.`
        }
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'Discord server'), message.channel);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'leave',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leave <guild_id>',
  example: [ 'leave 441122339988775566' ]
};
