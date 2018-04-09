/**
 * @file terms command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Bastion Bot - Terms of Service',
      url: 'https://bastionbot.org/',
      description: '\nBastion has access to the End User Data through the Discord API, but Bastion does not collect, use and/or disclose End User Data except (a) as necessary to exercise your rights under this Agreement, (b) in accordance with Discord’s Privacy Policy.' +
        '\n\nWe will never sell, license or otherwise commercialize any End User Data. Neither will we ever use End User Data to target End Users for marketing or advertising purposes. We will never even disclose any End User Data to any ad network, data broker or other advertising or monetization related service.' +
        '\n\nEnd User Data will be retained only as necessary to provide the defined functionality of the Application and nothing more.' +
        '\n\nWe ensure that all End User Data is stored using reasonable security measures and we take reasonable steps to secure End User Data.' +
        '\n\nBy using Bastion you expressly agree to this Agreement. And by using Discord you expressly agree to Discord’s [Terms of Service](https://discordapp.com/terms), [Guidelines](https://discordapp.com/guidelines) and [Privacy Policy](https://discordapp.com/privacy).' +
        '\n\n\n*“End User Data” means all data associated with the content within the functionality enabled by the Discord API, including but not limited to message content, message metadata, voice data and voice metadata.*'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'terms',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'terms',
  example: []
};
