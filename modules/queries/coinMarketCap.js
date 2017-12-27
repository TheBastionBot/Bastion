/**
 * @file coinMarketCap command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  if (!args.name || !args.name.length) {
    /**
    * The command was ran with invalid parameters.
    * @fires commandUsage
    */
    return Bastion.emit('commandUsage', message, this.help);
  }

  request({
    headers: {
      'User-Agent': `Bastion: Discord Bot (https://bastionbot.org, ${Bastion.package.version})`
    },
    uri: `https://api.coinmarketcap.com/v1/ticker/${encodeURIComponent(args.name.join('-').toLowerCase())}`
  }, (err, res, body) => {
    try {
      if (err) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
      }

      if (res) {
        if (res.statusCode === 200) {
          body = JSON.parse(body);
          body = body[0];

          message.channel.send({
            embed: {
              color: Bastion.colors.BLUE,
              title: body.name,
              fields: [
                {
                  name: 'Symbol',
                  value: body.symbol,
                  inline: true
                },
                {
                  name: 'Rank',
                  value: body.rank,
                  inline: true
                },
                {
                  name: 'Price',
                  value: `$${body.price_usd} USD\n${body.price_btc} BTC`,
                  inline: true
                },
                {
                  name: 'Market Cap',
                  value: `$${body.market_cap_usd} USD`,
                  inline: true
                },
                {
                  name: 'Circulating Supply',
                  value: `${body.available_supply} ${body.symbol}`,
                  inline: true
                },
                {
                  name: 'Maximum Supply',
                  value: body.max_supply ? `${body.max_supply} ${body.symbol}` : '-',
                  inline: true
                },
                {
                  name: 'Volume (24h)',
                  value: `$${body['24h_volume_usd']} USD`,
                  inline: true
                },
                {
                  name: 'Change',
                  value: `${body.percent_change_1h}% in the past hour\n${body.percent_change_24h}% in the past day\n${body.percent_change_7d}% in the past week`,
                  inline: true
                }
              ],
              thumbnail: {
                url: `https://files.coinmarketcap.com/static/img/coins/128x128/${body.id}.png`
              },
              footer: {
                text: 'Powered by CoinMarketCap'
              }
            }
          }).catch(e => {
            Bastion.log.error(e);
          });
        }
        else {
          return Bastion.emit('error', res.statusCode, res.statusMessage, message.channel);
        }
      }
    }
    catch (e) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'parseError'), Bastion.strings.error(message.guild.language, 'parse', true), message.channel);
    }
  });
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
