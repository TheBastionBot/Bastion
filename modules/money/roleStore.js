/**
 * @file roleStore command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let guildShop = await message.client.db.get(`SELECT roles FROM guildShop WHERE guildID=${message.guild.id}`);

    let rolesInStore;
    if (guildShop && guildShop.roles) {
      rolesInStore = await Bastion.functions.decodeString(guildShop.roles);
      rolesInStore = JSON.parse(rolesInStore);
    }
    else {
      rolesInStore = {};
    }

    if (args.add) {
      if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
      }

      if (Object.keys(rolesInStore).length >= 25) {
        return Bastion.emit('error', '', 'You can\'t add more than 25 roles for sale.', message.channel);
      }

      args.add = Math.abs(args.add);

      let role = message.guild.roles.get(args.role);

      if (!role) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
      }

      rolesInStore[role.id] = args.add;

      rolesInStore = JSON.stringify(rolesInStore);
      rolesInStore = await Bastion.functions.encodeString(rolesInStore);

      await Bastion.db.run('INSERT OR REPLACE INTO guildShop(guildID, roles) VALUES(?, ?)', [ message.guild.id, rolesInStore ]);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Listed **${role.name}** role for sale in the Role Store for **${args.add}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (args.remove) {
      if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
      }

      delete rolesInStore[args.role];

      rolesInStore = JSON.stringify(rolesInStore);
      rolesInStore = await Bastion.functions.encodeString(rolesInStore);

      await Bastion.db.run('INSERT OR REPLACE INTO guildShop(guildID, roles) VALUES(?, ?)', [ message.guild.id, rolesInStore ]);

      let role;
      if (message.guild.roles.has(args.role)) {
        role = message.guild.roles.get(args.role).name;
      }
      else {
        role = args.role;
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `Unlisted **${role}** role from the Role Store.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let roles = Object.keys(rolesInStore).filter(role => message.guild.roles.has(role)).map(role => message.guild.roles.get(role));

      if (roles.length) {
        let fields = [];
        for (let role of roles) {
          fields.push({
            name: `${role.name} (${role.id})`,
            value: `${rolesInStore[role.id]} Bastion Currencies`
          });
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: 'Role Store',
            description: 'Buy a role using the `buyRole` command.\nUse `help buyRole` command for more info.',
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
            title: 'Role Store',
            description: 'No role\'s for sale in this server at this time.'
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
  aliases: [ 'roleShop' ],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, defaultOption: true },
    { name: 'add', type: Number, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'roleStore',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roleStore [ --add AMOUNT ROLE_ID | --remove ROLE_ID ]',
  example: [ 'roleStore', 'roleStore --add 100 277132449585713251', 'roleStore --remove 277132449585713251' ]
};
