/**
 * @file setBio command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let charLimit = 350;
  let bio = args.join(' ').replace('"', '\'');

  if (bio.length > charLimit) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `Your bio can't exceed ${charLimit} characters.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  Bastion.db.get(`SELECT bio FROM profiles WHERE userID=${message.author.id}`).then(user => {
    if (!user) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your bio.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    Bastion.db.run(`UPDATE profiles SET bio="${bio}" WHERE userID=${message.author.id}`).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Bio Set',
          description: bio,
          footer: {
            text: args.tag
          }
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setbio',
  description: 'Shows a mentioned person\'s avatar. If no one is mentioned, it wil show your avatar.',
  botPermission: '',
  userPermission: '',
  usage: 'setBio <text>',
  example: [ 'setBio I\'m awesome. :sunglasses:' ]
};
