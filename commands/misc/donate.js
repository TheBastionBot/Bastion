/**
 * @file donate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let data = await Bastion.methods.makeExtractionRequest('/bastion/donate');

  await message.channel.send({
    embed: {
      color: Bastion.colors.DARK_GREEN,
      title: 'Support Bastion\'s development',
      url: data.link,
      description: '**Share your appreciation and get cool rewards!**' +
                   '\nDonate to support the development of Bastion and keep it running forever.' +
                   '\n\nYou can donate via the methods below and get the rewards as mentioned in our Patreon tiers.',
      fields: data.methods.map(method => ({
        name: method.name,
        value: `${method.description}\n${method.link}`
      })),
      footer: {
        text: 'If everyone using Bastion gave $1, we could keep Bastion thriving for years to come.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'donate',
  description: 'Instructions on how to financially support the development of the Bastion Bot project.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'donate',
  example: []
};
