/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.trigger || !(args.text || args.embed)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let responseObject = {};

    if (args.text) {
      responseObject.text = args.text.join(' ');
    }
    if (args.embed) {
      args.embed = args.embed.join(' ');
      Object.assign(responseObject, JSON.parse(args.embed));

      responseObject.footer = {
        text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from me or my owners.'}`
      };
    }

    await Bastion.database.models.trigger.create({
      guildID: message.guild.id,
      trigger: args.trigger.join(' '),
      responseMessage: responseObject
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
            value: args.embed
              ? args.embed.length > 1024
                ? '*A Message Embed.*'
                : `\`\`\`json\n${args.embed}\`\`\``
              : args.text.join(' ')
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
    { name: 'text', type: String, alias: 't', multiple: true },
    { name: 'embed', type: String, alias: 'e', multiple: true }
  ]
};

exports.help = {
  name: 'addTrigger',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addTrigger <trigger text> <-t text response | -e embed object> ',
  example: [ 'addTrigger Hi, there? -t Hello $user! :wave:', 'addTrigger Hi, there? -e { "description": "Hello $user! :wave:"}' ]
};
