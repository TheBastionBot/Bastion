/**
 * @file setBirthDate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.date) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.date = Date.parse(args.date.join(' '));

    if (!args.date) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'date'), message.channel);
    }

    let age = Date.now() - args.date;
    let year = 31556952000;

    if (age > 100 * year) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'ageAbove100', true), message.channel);
    }
    else if (age < 13 * year) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'ageBelow13', true), message.channel);
    }

    let user = await Bastion.db.get(`SELECT birthDate FROM profiles WHERE userID=${message.author.id}`).catch(() => {});

    if (!user) {
      return message.channel.send({
        embed: {
          description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your birth date.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.db.run('UPDATE profiles SET birthDate=(?) WHERE userID=(?)', [ args.date, message.author.id ]);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Birth Date Set',
        description: `See you on your Birthday, ${message.author.tag}!`
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
  aliases: [ 'setBDate' ],
  enabled: true,
  argsDefinitions: [
    { name: 'date', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setBirthDate',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setBirthDate <DATE>',
  example: [ 'setBirthDate 2/20/2002' ]
};
