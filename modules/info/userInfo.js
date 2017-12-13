/**
 * @file userInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user, member;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      member = await message.guild.fetchMember(args.id);
      if (member) {
        user = member.user;
      }
    }
    if (!user) {
      user = message.author;
    }
    if (!member) {
      member = await message.guild.fetchMember(user.id);
    }
    let nick = member.nickname;
    if (!nick) {
      nick = '-';
    }
    let status = user.presence.status;
    if (status === 'online') {
      status = 'Online';
    }
    else if (status === 'idle') {
      status = 'Idle';
    }
    else if (status === 'dnd') {
      status = 'Do Not Disturb';
    }
    else {
      status = 'Invisible';
    }
    let isStream = 'Current Game';
    if (user.presence.game && user.presence.game.streaming) {
      isStream = 'Current Stream';
    }
    let game;
    if (user.presence.game === null) {
      game = '-';
    }
    else if (user.presence.game.streaming) {
      game = `[${user.presence.game.name}](${user.presence.game.url})`;
    }
    else {
      game = user.presence.game.name;
    }
    let roles = member.roles.map(r => r.name).slice(1).join('\n');
    if (roles.length === 0) roles = '-';

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `${user.bot ? 'Bot' : 'User'} Info`,
        fields: [
          {
            name: 'Name',
            value: user.tag,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          },
          {
            name: 'Nickname',
            value: nick,
            inline: true
          },
          {
            name: 'Roles',
            value: roles,
            inline: true
          },
          {
            name: 'Joined Server',
            value: member.joinedAt.toUTCString(),
            inline: true
          },
          {
            name: 'Joined Discord',
            value: user.createdAt.toUTCString(),
            inline: true
          },
          {
            name: 'Status',
            value: status,
            inline: true
          },
          {
            name: isStream,
            value: game,
            inline: true
          }
        ],
        thumbnail: {
          url: user.displayAvatarURL.split('?')[0]
        },
        footer: {
          text: `${message.guild.ownerID === user.id ? 'Server Owner' : ''}`,
          icon_url: `${message.guild.ownerID === user.id ? 'https://i.imgur.com/2ogsleu.png' : ''}`
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
  aliases: [ 'uinfo' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'userInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userInfo [@USER_MENTION | USER_ID]',
  example: [ 'userInfo @user#0001', 'userInfo 167122669385743441', 'userInfo' ]
};
