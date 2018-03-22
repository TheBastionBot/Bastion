/**
 * @file userLookup command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let user = await Bastion.fetchUser(args.id);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `${user.bot ? 'Bot' : 'User'} Lookup`,
        fields: [
          {
            name: 'Username',
            value: user.username,
            inline: true
          },
          {
            name: 'Discriminator',
            value: user.discriminator,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          }
        ],
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'uLookup' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'userLookup',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userLookup <USER_ID>',
  example: [ 'userLookup 167122669385743141' ]
};
