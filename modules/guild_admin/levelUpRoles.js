/**
 * @file levelUpRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT levelUpRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    let levelUpRoles;
    if (guildSettings && guildSettings.levelUpRoles) {
      levelUpRoles = await Bastion.functions.decodeString(guildSettings.levelUpRoles);
      levelUpRoles = JSON.parse(levelUpRoles);
    }
    else {
      levelUpRoles = {};
    }

    if (args.level && args.role) {
      if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
      }

      if (Object.keys(levelUpRoles).length >= 25) {
        return Bastion.emit('error', '', 'You can\'t add more than 25 level up roles.', message.channel);
      }

      args.level = Math.abs(args.level).toString();

      let role = message.guild.roles.get(args.role);

      if (!role) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
      }

      if (levelUpRoles.hasOwnProperty(args.level)) {
        levelUpRoles[args.level] += ` ${role.id}`;
      }
      else {
        levelUpRoles[args.level] = role.id;
      }

      levelUpRoles = JSON.stringify(levelUpRoles);
      levelUpRoles = await Bastion.functions.encodeString(levelUpRoles);

      await Bastion.db.run('INSERT OR REPLACE INTO guildSettings(guildID, levelUpRoles) VALUES(?, ?)', [ message.guild.id, levelUpRoles ]);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: Bastion.strings.info(message.guild.language, 'addLevelUpRole', message.author.tag, role.name, args.level)
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (args.remove) {
      delete levelUpRoles[args.remove];

      levelUpRoles = JSON.stringify(levelUpRoles);
      levelUpRoles = await Bastion.functions.encodeString(levelUpRoles);

      await Bastion.db.run('INSERT OR REPLACE INTO guildSettings(guildID, levelUpRoles) VALUES(?, ?)', [ message.guild.id, levelUpRoles ]);

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: Bastion.strings.info(message.guild.language, 'removeLevelUpRoles', message.author.tag, args.remove)
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      if (Object.keys(levelUpRoles).length) {
        let fields = [];

        for (let level in levelUpRoles) {
          if (levelUpRoles.hasOwnProperty(level)) {
            let roles = levelUpRoles[level].split(' ').filter(role => message.guild.roles.has(role)).map(role => message.guild.roles.get(role).name);

            fields.push({
              name: `Level ${level}`,
              value: roles.join(', ')
            });
          }
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: 'Level up Roles',
            description: 'Roles to be added to users when they level up in this server.',
            fields: fields
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      else {
        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            description: 'No level up roles are set in this server.'
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'level', type: Number, defaultOption: true },
    { name: 'role', type: String, alias: 'r' },
    { name: 'remove', type: String }
  ]
};

exports.help = {
  name: 'levelUpRoles',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'levelUpRoles [ LEVEL --role ROLE_ID ] [ --remove LEVEL ]',
  example: [ 'levelUpRoles', 'levelUpRoles 10 --role 443322110055998877', 'levelUpRoles --remove 10' ]
};
