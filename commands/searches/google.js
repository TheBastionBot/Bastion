/**
 * @file google command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');
const cheerio = xrequire('cheerio');

exports.exec = async (Bastion, message, args) => {
  if (!args.query) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:68.0) Gecko/20100101 Firefox/68.0'
    },
    url: 'http://google.com/search',
    qs: {
      q: args.query.join(' '),
      safe: 'active'
    }
  };
  let response = await request(options);

  let $ = cheerio.load(response);
  let results = [];

  $('.g').each((i) => {
    results[i] = {};
  });
  $('.g .r a h3').each((i, e) => {
    let link = e.parent.attribs['href'];
    results[i]['name'] = `${getText(e)} - ${link}`;
  });
  $('.g .s .st').each((i, e) => {
    results[i]['value'] = getText(e);
  });

  results = results.filter(r => r.name && r.value).slice(0, 3);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Search results for ${args.query.join(' ')}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(args.query.join(' '))}`,
      fields: results,
      footer: {
        text: 'Powered by Google'
      }
    }
  });
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
  description: 'Searches Google, for the specified query, and shows the top results.',
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
