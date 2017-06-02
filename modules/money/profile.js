/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!(args = message.mentions.users.first())) {
    args = message.author;
  }
  sql.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp>p1.xp) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`).then(profile => {
    if (!profile) {
      if (args === message.author) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.green,
            description: `Your profile is now created, <@${args.id}>`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }

      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `<@${args.id}>'s profile is not yet created.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: args.tag,
        description: profile.bio || 'No bio set. Set your bio using `setBio` command.',
        fields: [
          {
            name: 'Bastion Currency',
            value: profile.bastionCurrencies,
            inline: true
          },
          {
            name: 'Rank',
            value: profile.rank + 1,
            inline: true
          },
          {
            name: 'Experience Points',
            value: profile.xp,
            inline: true
          },
          {
            name: 'Level',
            value: profile.level,
            inline: true
          }
        ],
        thumbnail: {
          url: args.displayAvatarURL
        }
      }
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
  name: 'profile',
  description: 'Shows a mentioned user\'s Bastion profile. If no one is mentioned, shows your profile.',
  botPermission: '',
  userPermission: '',
  usage: 'profile [@user-mention]',
  example: [ 'profle', 'profile @user#0001' ]
};
