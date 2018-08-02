/**
 * @file donate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.DARK_GREEN,
      title: 'Support Bastion\'s development',
      url: 'https://bastionbot.org/donate',
      description: '**Share your appreciation and get cool rewards!**' +
                   '\nDonate to support the development of Bastion and keep it running forever.' +
                   '\n\nYou can donate via the methods below and get the rewards as mentioned in our Patreon tiers.',
      fields: [
        {
          name: 'Patreon',
          value: 'You can pledge for The Bastion Bot Project on Patreon:'
                + '\nhttps://patreon.com/bastionbot'
        },
        {
          name: 'PayPal',
          value: 'You can send one-off donations via PayPal:'
                + '\nhttps://paypal.me/snkrsnkampa'
        },
        {
          name: 'Cryptocurrencies',
          value: 'You can send one-off donations with Cryptocurrencies:'
                + '\nhttps://commerce.coinbase.com/checkout/ff8b08ec-5d39-4910-89cd-8267cd5c3c54'
        }
      ],
      footer: {
        text: 'If everyone using Bastion gave $1, we could keep Bastion thriving for months to come.'
      }
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
  name: 'donate',
  description: 'Instructions on how to financially support the development of the Bastion Bot project.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'donate',
  example: []
};
