/**
 * @file reputation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let recentUsers = [];
const COOLDOWN = 12;

exports.exec = async (Bastion, message, args) => {
  if (/^tay(?:lor)?(?: alison)?(?: swift)?$/i.test(args.length && args.join(' '))) {
    let reputationLyrics = [
      'Big **reputation**, big **reputation**\nOoh, you and me, we got big **reputations**, ah\nAnd you heard about me, ooh',
      'Big **reputation**, big **reputation**\nOoh, you and me would be a big conversation, ah\nAnd I heard about you, ooh',
      'I got a **reputation**, girl, that don\'t precede me\nI\'m one call away whenever you need me',
      'I got issues and chips on both of my shoulders\n**Reputation** precedes me, in rumors, I\'m knee-deep'
    ];
    return message.channel.send({
      embed: {
        description: reputationLyrics.getRandom()
      }
    }).catch(() => {});
  }

  if (!recentUsers.includes(message.author.id)) {
    let user = message.mentions.users.first();
    if (!user) return;
    if (user.id === message.author.id) {
      return Bastion.emit('error', '', 'You can\'t give karma to yourself!', message.channel);
    }

    let [ guildMemberModel, initialized ] = await message.client.database.models.guildMember.findOrBuild({
      where: {
        userID: user.id,
        guildID: message.guild.id
      },
      defaults: {
        experiencePoints: 1,
        karma: 1
      }
    });
    if (initialized) {
      await guildMemberModel.save();
    }
    else {
      await message.client.database.models.guildMember.update({
        karma: parseInt(guildMemberModel.dataValues.karma) + 1
      },
      {
        where: {
          userID: user.id,
          guildID: message.guild.id
        },
        fields: [ 'karma' ]
      });
    }

    recentUsers.push(message.author.id);
    setTimeout(() => {
      recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
    }, COOLDOWN * 60 * 60 * 1000);

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `You have given one karma to ${user.tag}`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    return Bastion.emit('error', '', `You have recently given karma to someone, please wait at least ${COOLDOWN} hours before giving karma again.`, message.channel);
  }
};

exports.config = {
  aliases: [ 'rep', 'karma' ],
  enabled: true
};

exports.help = {
  name: 'reputation',
  description: 'Give karma to other users. You can give karma only once in 12 hours.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reputation <@USER_MENTION>',
  example: [ 'reputation @k3rn31p4nic#8383' ]
};
