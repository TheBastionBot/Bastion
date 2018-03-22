/**
 * @file coinMarketCap command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name || !args.name.length) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'User-Agent': `Bastion: Discord Bot (https://bastionbot.org, ${Bastion.package.version})`
      },
      url: `https://api.coinmarketcap.com/v1/ticker/${encodeURIComponent(args.name.join('-').toLowerCase())}`,
      json: true
    };
    let response = await request(options);

    response = response[0];

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: response.name,
        fields: [
          {
            name: 'Symbol',
            value: response.symbol,
            inline: true
          },
          {
            name: 'Rank',
            value: response.rank,
            inline: true
          },
          {
            name: 'Price',
            value: `$${response.price_usd} USD\n${response.price_btc} BTC`,
            inline: true
          },
          {
            name: 'Market Cap',
            value: `$${response.market_cap_usd} USD`,
            inline: true
          },
          {
            name: 'Circulating Supply',
            value: `${response.available_supply} ${response.symbol}`,
            inline: true
          },
          {
            name: 'Maximum Supply',
            value: response.max_supply ? `${response.max_supply} ${response.symbol}` : '-',
            inline: true
          },
          {
            name: 'Volume (24h)',
            value: `$${response['24h_volume_usd']} USD`,
            inline: true
          },
          {
            name: 'Change',
            value: `${response.percent_change_1h}% in the past hour\n${response.percent_change_24h}% in the past day\n${response.percent_change_7d}% in the past week`,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://files.coinmarketcap.com/static/img/coins/128x128/${response.id}.png`
        },
        footer: {
          text: 'Powered by CoinMarketCap'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'coinMarketCap',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'coinMarketCap <CRYPTOCURRENCY_NAME>',
  example: [ 'coinMarketCap bitcoin' ]
};
