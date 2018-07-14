/**
 * @file followURL command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let url = args.url.join(' ');

    if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(url)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
    }

    let followedUrl = await Bastion.methods.followURL(url);

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
  description: 'Follows a URL to until it reaches the last URL and shows you the followed URL. Useful for getting past shortened URLs.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'followURL',
  example: []
};
