/**
 * @file followURL command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const followURL = require('../../functions/followURL');

exports.run = (Bastion, message, args) => {
  let url = args.url.join(' ');

  if (!/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/i.test(url)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Invalid Data', 'The URL is not valid.', message.channel);
  }

  followURL(url).then(followedUrl => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
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
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'followurl',
  description: string('followURL', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'endpoll',
  example: []
};
