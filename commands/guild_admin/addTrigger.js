/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const emojis = xrequire('./assets/emojis.json');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.trigger || !(args.text || args.embed || args.reaction)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let triggerModels = await message.client.database.models.trigger.findAll({
      attributes: [ [ message.client.database.fn('COUNT', message.client.database.col('trigger')), 'noOfTriggers' ] ],
      where: {
        guildID: message.guild.id
      }
    });

    if (!Bastion.credentials.ownerId.includes(message.author.id) && triggerModels && triggerModels.dataValues.noOfTriggers >= 10) {
      return Bastion.emit('error', 'forbidden', 'You can\'t set more than 10 triggers per server, for now. This limit will be increased in the future.', message.channel);
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
    if (args.reaction) {
      args.reaction = encodeURIComponent(args.reaction);

      if (!emojis.includes(args.reaction)) {
        if (!Object.keys(responseObject).size) {
          return Bastion.emit('error', 'invalidInput', 'The emoji you entered is invalid. Note that custom emojis aren\'t supported currently.', message.channel);
        }
      }
    }

    await Bastion.database.models.trigger.create({
      guildID: message.guild.id,
      trigger: args.trigger.join(' '),
      responseMessage: responseObject,
      responseReactions: args.reaction
    },
    {
      fields: [ 'guildID', 'trigger', 'responseMessage', 'responseReactions' ]
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
              : args.text
                ? args.text.join(' ')
                : decodeURIComponent(args.reaction)
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
    { name: 'embed', type: String, alias: 'e', multiple: true },
    { name: 'reaction', type: String, alias: 'r' }
  ]
};

exports.help = {
  name: 'addTrigger',
  description: 'Adds a message trigger and a response. When a message is sent that contains that triggering word/phrase, Bastion replies with the response you have set.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addTrigger <trigger text> <-t text response | -e embed object | -r reaction emoji> ',
  example: [ 'addTrigger Hi, there? -t Hello $user! :wave:', 'addTrigger Hi, there? -e { "description": "Hello $user! :wave:"}', 'addTrigger Hi, there? -r :wave:' ]
};
