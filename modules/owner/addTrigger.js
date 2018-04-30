/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.trigger || !args.text) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    await Bastion.database.models.trigger.create({
      guildID: message.guild.id,
      trigger: args.trigger.join(' '),
      responseMessage: { text: args.text.join(' ') }
    },
    {
      fields: [ 'guildID', 'trigger', 'responseMessage' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'New Trigger Added',
        fields: [
          {
            name: 'Trigger',
            value: args.trigger.join(' ')
          },
          {
            name: 'Response',
            value: args.text.join(' ')
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'addtrip' ],
  enabled: true,
  argsDefinitions: [
    { name: 'trigger', type: String, multiple: true, defaultOption: true },
    { name: 'text', type: String, alias: 't', multiple: true }
  ]
};

exports.help = {
  name: 'addTrigger',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addTrigger <trigger text> <-t text response>',
  example: [ 'addTrigger Hi, there? -t Hello $user! :wave:' ]
};
