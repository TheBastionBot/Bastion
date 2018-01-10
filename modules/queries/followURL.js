/**
 * @file followURL command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const followURL = require('../../functions/followURL');

exports.exec = async (Bastion, message, args) => {
  try {
    let url = args.url.join(' ');

    if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(url)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
    }

    let followedUrl = await followURL(url);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        fields: [
          {
            name: 'URL',
            value: url
          },
          {
            name: 'Followed URL',
            value: followedUrl
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'followURL',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'followURL',
  example: []
};
