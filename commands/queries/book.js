/**
 * @file book command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {

  try {
    if(!args.book) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
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

    // Check if the book was found
    if(books.totalItems < 1) {
      /**
       * No result for this query
       * @fires error
       */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'book'), message.channel);
    }

    const { items: [ book,,  ] } = books;

    console.log(book.volumeInfo);

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
const createEmbed = ({ title, description, categories, authors, pageCount, imageLinks: { smallThumbnail: imageUrl }, infoLink, averageRating }, Bastion) => {

  const embed = {
    color: Bastion.colors.BLUE,
    title: title,
    description: `${description.substring(0, 150)}...`,
    fields: [
      {
        name: 'Authors',
        value: authors.join(', '),
        inline: true
      },
      {
        name: 'Number of pages',
        value: pageCount,
        inline: true
      },
      {
        name: 'Average rating',
        value: toString(averageRating),
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
  };

  if(typeof categories !== 'undefined') {
    embed.fields.push({
      name: 'Categories',
      value: categories.join(', '),
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
