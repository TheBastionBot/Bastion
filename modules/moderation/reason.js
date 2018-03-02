/**
 * @file reason command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id || !args.reason) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildSettings = await Bastion.db.get(`SELECT modLog, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (!guildSettings || !guildSettings.modLog) return;

    let modLogChannel = message.guild.channels.get(guildSettings.modLog);
    if (!modLogChannel) return;

    let modMessage = await modLogChannel.fetchMessage(args.id);

    if (modMessage && modMessage.embeds.length) {
      if (modMessage.embeds[0].fields.filter(field => field.name === 'Reason').length === 1) {
        let newEmbed = {
          color: modMessage.embeds[0].color,
          title: modMessage.embeds[0].title,
          description: modMessage.embeds[0].description,
          fields: modMessage.embeds[0].fields.map(field => {
            return {
              name: field.name,
              value: field.value,
              inline: field.inline
            };
          }),
          footer: {
            text: modMessage.embeds[0].footer.text
          },
          timestamp: modMessage.embeds[0].createdTimestamp
        };

        if (!message.channel.permissionsFor(message.member).has('MANAGE_GUILD') && (newEmbed.fields.filter(field => field.name === 'Moderator ID').length && message.author.id !== newEmbed.fields.filter(field => field.name === 'Moderator ID')[0].value)) return;

        args.reason = args.reason.join(' ');
        newEmbed.fields.filter(field => field.name === 'Reason')[0].value = args.reason;

        modMessage.edit({
          embed: newEmbed
        });

        message.channel.send({
          embed: {
            color: Bastion.colors.GREEN,
            description: Bastion.strings.info(message.guild.language, 'updateReason', message.author.tag, newEmbed.footer.text, args.reason)
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
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
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', type: String, alias: 'r', multiple: true }
  ]
};

exports.help = {
  name: 'reason',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reason <MOD_LOG_MESSAGE_ID> <-r NEW REASON>',
  example: [ 'reason 210646349113751801 -r Bad behaviour' ]
};
