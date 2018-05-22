/**
 * @file setLocation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.location) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.location = args.location.join(' ');

    let charLimit = 20;
    if (args.location.length > charLimit) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'locationRange', charLimit), message.channel);
    }

    let userModel = await Bastion.database.models.user.findOne({
      attributes: [ 'location' ],
      where: {
        userID: message.author.id
      }
    });

    if (!userModel) {
      return message.channel.send({
        embed: {
          description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your location.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.database.models.user.update({
      location: args.location
    },
    {
      where: {
        userID: message.author.id
      },
      fields: [ 'location' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Location Set',
        description: `${message.author.tag}, your location has been set to ${args.location}.`
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'location', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setLocation',
  description: 'Sets your location that shows up in the Bastion user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setLocation <CITY>',
  example: [ 'setLocation New York' ]
};
