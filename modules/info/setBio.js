/**
 * @file setBio command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    args = args.join(' ');

    let charLimit = 160;
    let bio = await Bastion.functions.encodeString(args);

    if (bio.length > charLimit) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'bioRange', true, charLimit), message.channel);
    }

    let userModel = await Bastion.database.models.user.findOne({
      attributes: [ 'bio' ],
      where: {
        userID: message.author.id
      }
    });

    if (!userModel) {
      return message.channel.send({
        embed: {
          description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your bio.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.database.models.user.update({
      bio: bio
    },
    {
      where: {
        userID: message.author.id
      },
      fields: [ 'bio' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Bio Set',
        description: args,
        footer: {
          text: args.tag
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setBio',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setBio <text>',
  example: [ 'setBio I\'m awesome. :sunglasses:' ]
};
