/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (!(user = message.mentions.users.first())) user = message.author;
  if (!(nick = message.guild.members.get(user.id).nickname)) nick = "-";
  let status = user.presence.status;
  if (status == "online") {
    status = "Online";
  } else if (status == "idle") {
    status = "Idle";
  } else if (status == "dnd") {
    status = "Do Not Disturb";
  } else {
    status = "Invisible";
  }
  let isStream = 'Current Game';
  if (user.presence.game && user.presence.game.streaming)
    isStream = 'Current Stream';
  if (user.presence.game == null) {
    game = '-';
  } else if (user.presence.game.streaming) {
    game = `[${user.presence.game.name}](${user.presence.game.url})`;
  } else {
    game = user.presence.game.name;
  }
  let roles = message.guild.members.get(user.id).roles.map(r=>r.name).slice(1).join("\n");
  if (roles == '') roles = '-';

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'User Info',
    fields: [
      {
        name: "Name",
        value: `**${user.username}**#${user.discriminator}`,
        inline: true
      },
      {
        name: "ID",
        value: user.id,
        inline: true
      },
      {
        name: "Nickname",
        value: nick,
        inline: true
      },
      {
        name: "Roles",
        value: roles,
        inline: true
      },
      {
        name: "Joined Server",
        value: message.guild.members.get(user.id).joinedAt.toUTCString(),
        inline: true
      },
      {
        name: "Joined Discord",
        value: user.createdAt.toUTCString(),
        inline: true
      },
      {
        name: "Status",
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
      url: user.avatarURL
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['uinfo']
};

exports.help = {
  name: 'userinfo',
  description: 'Shows information about the mentioned user. If no user is mentioned, shows information about you.',
  permission: '',
  usage: 'userInfo [@user-mention]',
  example: ['userInfo @user#0001', 'userInfo']
};
