/**
 * @file reputation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let recentUsers = [];
const COOLDOWN = 12;

exports.exec = async (Bastion, message, args) => {
  try {
    if (/^tay(?:lor)?(?: alison)?(?: swift)?$/i.test(args.length && args.join(' '))) {
      let reputationLyrics = [
        'Big **reputation**, big **reputation**\nOoh, you and me, we got big **reputations**, ah\nAnd you heard about me, ooh',
        'Big **reputation**, big **reputation**\nOoh, you and me would be a big conversation, ah\nAnd I heard about you, ooh',
        'I got a **reputation**, girl, that don\'t precede me\nI\'m one call away whenever you need me',
        'I got issues and chips on both of my shoulders\n**Reputation** precedes me, in rumors, I\'m knee-deep'
      ];
      return message.channel.send({
        embed: {
          description: reputationLyrics[Math.floor(Math.random() * reputationLyrics.length)]
        }
      }).catch(() => {});
    }

    if (!recentUsers.includes(message.author.id)) {
      let user = message.mentions.users.first();
      if (!user) return;
      if (user.id === message.author.id) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', '', 'You can\'t give reputation to yourself!', message.channel);
      }

      let [ guildMemberModel, initialized ] = await message.client.database.models.guildMember.findOrBuild({
        where: {
          userID: message.author.id,
          guildID: message.guild.id
        },
        defaults: {
          experiencePoints: 1,
          reputations: 1
        }
      });
      if (initialized) {
        await guildMemberModel.save();
      }
      else {
        await message.client.database.models.guildMember.update({
          reputations: parseInt(guildMemberModel.dataValues.reputations) + 1
        },
        {
          where: {
            userID: message.author.id,
            guildID: message.guild.id
          },
          fields: [ 'reputations' ]
        });
      }

      recentUsers.push(message.author.id);
      setTimeout(() => {
        recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
      }, COOLDOWN * 60 * 60 * 1000);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `You have given one reputation to ${user.tag}`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', `You have recently given reputation to someone, please wait at least ${COOLDOWN} hours before giving reputation again.`, message.channel);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'rep' ],
  enabled: true
};

exports.help = {
  name: 'reputation',
  description: 'Give reputations to other users. You can give reputation only once in 12 hours.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reputation <@USER_MENTION>',
  example: [ 'reputation @k3rn31p4nic#8383' ]
};
