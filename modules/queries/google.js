/**
 * @file google command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');
const cheerio = require('cheerio');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.query) {
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
      url: 'http://google.com/search',
      qs: {
        q: encodeURIComponent(args.query.join(' ')),
        safe: 'active'
      }
    };
    let response = await request(options);

    let $ = cheerio.load(response);
    let results = [];

    $('.g').each((i) => {
      results[i] = {};
    });
    $('.g>.r>a').each((i, e) => {
      let raw = e.attribs['href'];
      results[i]['name'] = `${getText(e)} - ${raw.substr(7, raw.indexOf('&sa=U') - 7)}`;
    });
    $('.g>.s>.st').each((i, e) => {
      results[i]['value'] = getText(e);
    });

    results = results.filter(r => r.name && r.value).slice(0, 3);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `Search results for ${args.query.join(' ')}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(args.query.join(' '))}`,
        fields: results,
        footer: {
          text: 'Powered by Google'
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
    { name: 'query', type: String, alias: 'q', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'google',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'google <query>',
  example: [ 'google Bastion Bot' ]
};

/**
 * Get the main text/data of a HTML element returned by cheerio
 * @function getText
 * @param {object} children object containing properties of the HTML element, returned by cheerio
 * @returns {string} The main text/data of the HTML element
 */
function getText(children) {
  if (children.children) return getText(children.children);
  return children.map(c => {
    return c.children ? getText(c.children) : c.data;
  }).join('');
}
