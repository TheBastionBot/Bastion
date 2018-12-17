/**
 * @file book command
 * @author WebD
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.book) {
    return Bastion.emit('commandUsage', message, this.help);
  }


  const requestOptions = {
    method: 'GET',
    url: 'https://www.googleapis.com/books/v1/volumes',
    qs: {
      key: Bastion.credentials.googleAPIkey,
      q: encodeURIComponent(args.book.join(' '))
    },
    json: true
  };

  const books = await request(requestOptions);

  // Check if the book was found
  if (books.totalItems < 1) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'book'), message.channel);
  }

  const { items: [ book ] } = books;

  await message.channel.send({
    embed: createEmbed(book.volumeInfo, Bastion)
  }).catch(e => {
    Bastion.log.error(e);
  });
};

/**
 * Creates an embed with the book
 * @method createEmbed
 * @param {object} volumeInfo Details of the volume
 * @param {object} Bastion Bastion client object
 * @returns {object} The embed object of the book
 */
const createEmbed = (volumeInfo, Bastion) => {
  const embed = {
    color: Bastion.colors.BLUE,
    title: volumeInfo.title,
    description: `${volumeInfo.description.substring(0, 150)}...`,
    fields: [
      {
        name: 'Authors',
        value: volumeInfo.authors.join(', '),
        inline: true
      },
      {
        name: 'Number of pages',
        value: volumeInfo.pageCount,
        inline: true
      },
      {
        name: 'Average rating',
        value: `${volumeInfo.averageRating}`,
        inline: true
      },
      {
        name: 'Learn more about this book',
        value: `[Click here](${volumeInfo.infoLink})`
      }
    ],
    footer: {
      text: 'Powered by Google Books'
    },
    thumbnail: {
      url: volumeInfo.imageLinks.thumbnail
    }
  };

  if (volumeInfo.categories) {
    embed.fields.push({
      name: 'Categories',
      value: volumeInfo.categories.join(', '),
      inline: true
    });
  }

  return embed;
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'book', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'book',
  description: 'Searches for the details of a book',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'book <Book Name>',
  example: [ 'book A random book name' ]
};
