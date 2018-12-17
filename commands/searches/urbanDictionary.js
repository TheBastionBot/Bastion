/**
 * @file urbanDictionary command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!message.channel.nsfw) {
    return Bastion.emit('error', '', 'Urban Dictionary may return results that are NSFW, so this command works only in NSFW channels.', message.channel);
  }

  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    url: `https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`,
    json: true
  };
  let response = await request(options);

  response = response.list[0];

  if (!response) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'word'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Urban Dictionary',
      fields: [
        {
          name: 'Word',
          value: response.word || args.join(' ')
        },
        {
          name: 'Definition',
          value: response.definition || '-'
        },
        {
          name: 'Example',
          value: response.example || '-'
        }
      ],
      footer: {
        text: 'Powered by Urban Dictionary'
      }
    }
  });
};

exports.config = {
  aliases: [ 'ud' ],
  enabled: true
};

exports.help = {
  name: 'urbanDictionary',
  description: 'Searches the Urban Dictionary for an urban definition of the specified word.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'urbanDictionary <word>',
  example: [ 'urbanDictionary pineapple' ]
};
