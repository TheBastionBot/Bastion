/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.trigger || !args.response) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    await Bastion.database.models.trigger.create({
      guildID: message.guild.id,
      trigger: args.trigger.join(' '),
      responseMessage: args.response.join(' ')
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
            value: args.response.join(' ')
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
    { name: 'trigger', type: String, alias: 't', multiple: true, defaultOption: true },
    { name: 'response', type: String, alias: 'r', multiple: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'addTrigger',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'addTrigger <-t trigger message> <-r response message>',
  example: [ 'addTrigger -t Hi, there? -r Hello $user! :wave:' ]
};
