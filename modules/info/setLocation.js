/**
 * @file setLocation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
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
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'locationRange', true, charLimit), message.channel);
    }

    let user = await Bastion.db.get(`SELECT location FROM profiles WHERE userID=${message.author.id}`).catch(() => {});

    if (!user) {
      return message.channel.send({
        embed: {
          description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your location.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.db.run('UPDATE profiles SET location=(?) WHERE userID=(?)', [ args.location, message.author.id ]);

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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setLocation <CITY>',
  example: [ 'setLocation New York' ]
};
