/**
 * @file reason command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.number || !args.reason) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'moderationLog' ],
      where: {
        guildID: message.guild.id
      },
      include: [
        {
          model: message.client.database.models.moderationCase,
          attributes: [ 'guildID', 'number', 'messageID' ],
          where: {
            number: args.number
          }
        }
      ]
    });

    if (!guildModel || !guildModel.dataValues.moderationLog || !guildModel.moderationCases.length) return;

    let modLogChannel = message.guild.channels.get(guildModel.dataValues.moderationLog);
    if (!modLogChannel) return;

    let modMessage = await modLogChannel.fetchMessage(guildModel.moderationCases[0].dataValues.messageID);

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
            description: Bastion.i18n.info(message.guild.language, 'updateReason', message.author.tag, newEmbed.footer.text, args.reason)
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
    { name: 'number', type: String, defaultOption: true },
    { name: 'reason', type: String, alias: 'r', multiple: true }
  ]
};

exports.help = {
  name: 'reason',
  description: 'Add/Update the reason for a moderation action, which is logged in the moderation log channel. Only the responsible moderator or anyone with administrator permissions can change the reason.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reason <MOD_LOG_CASE_NO> <-r NEW REASON>',
  example: [ 'reason 1337 -r Bad behaviour' ]
};
