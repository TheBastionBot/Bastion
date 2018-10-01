/**
 * @file book command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {

  try {

    if(!args.book) {
      return Bastion.emit('commandUsage', message, this.help);
    }

    const requestOptions = {
      method: 'GET',
      url: `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(args.book)}&key=&query`,
      qs: {
        key: Bastion.credentials.googleAPIkey
      },
      json: true
    };

    const books = await request(requestOptions);


    if(books.totalItems < 1) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'book'), message.channel);
    }

    const { items: [ book,,  ] } = books;

    message.channel.send({ embed: createEmbed(book.volumeInfo, Bastion) }).
      catch(e => {
        Bastion.log.error(e);
      });

  }
  catch(e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }

};

/**
 * Creates an embed with the book
 * @param {object} book
 * @param {object} Bastion
 * @returns {object}
 */
const createEmbed = ({ title, description, categories, authors, publisher, pageCount, imageLinks: { smallThumbnail: imageUrl }, infoLink, averageRating }, Bastion) => ({
  color: Bastion.colors.BLUE,
  title: title,
  description: `${description.substring(0, 150)}...`,
  fields: [
    {
      name: 'Categories',
      value: categories.join(', '),
      inline: true
    },
    {
      name: 'Authors',
      value: authors.join(', '),
      inline: true
    },
    {
      name: 'Publisher',
      value: publisher,
      inline: true
    },
    {
      name: 'Number of pages',
      value: pageCount,
      inline: true
    },
    {
      name: 'Average rating',
      value: averageRating,
      inline: true
    },
    {
      name: 'Learn more about this book',
      value: `[Click here](${infoLink})`
    }
  ],
  footer: {
    text: 'Powered by Google Books'
  },
  thumbnail: {
    url: imageUrl
  }
});

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
