/**
 * @file beLikeBill command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    let options = {
      url: 'https://belikebill.azurewebsites.net/billgen-API.php',
      qs: {
        default: 1,
        name: message.member.displayName
      },
      encoding: null
    };

    if (args.sex) {
      args.sex = args.sex.toLowerCase();
      args.sex = [ 'female', 'male', 'f', 'm' ].includes(args.sex) ? args.sex[0] : null;
      options.qs.sex = args.sex;
    }

    let response = await request(options);

    await message.channel.send({
      files: [ response ]
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'beLikeMe' ],
  enabled: true,
  argsDefinitions: [
    { name: 'sex', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'beLikeBill',
  description: 'Sends a be like bill meme to make you feel morally superior to others.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'beLikeBill',
  example: []
};
