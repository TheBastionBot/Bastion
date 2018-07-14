/**
 * @file blacklist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.users) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    // Filter users with invalid snowflake.
    args.users = args.users.filter(userID => Bastion.methods.isSnowflake(userID));
    // Include mentioned users too.
    args.users = args.users.concat(message.mentions.users.map(user => user.id));
    if (!args.users.length) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'user'), message.channel);
    }

    let settingsModel = await Bastion.database.models.settings.findOne({
      attributes: [ 'blacklistedUsers' ],
      where: {
        botID: Bastion.user.id
      }
    });

    let title, filteredUsers;
    if (settingsModel && settingsModel.dataValues.blacklistedUsers) {
      if (args.remove) {
        title = 'Removed Blacklisted Users';

        args.users = args.users.filter(user => settingsModel.dataValues.blacklistedUsers.includes(user));

        if (!args.users.length) {
          return Bastion.emit('error', '', 'The specified users have not been blacklisted.', message.channel);
        }

        filteredUsers = args.users;
        for (let user of filteredUsers) {
          settingsModel.dataValues.blacklistedUsers.splice(settingsModel.dataValues.blacklistedUsers.indexOf(user), 1);
        }
        args.users = settingsModel.dataValues.blacklistedUsers;
      }
      else {
        title = 'Added Blacklisted Users';

        args.users = args.users.filter(user => !settingsModel.dataValues.blacklistedUsers.includes(user));

        if (!args.users.length) {
          return Bastion.emit('error', '', 'The specified users have already been blacklisted.', message.channel);
        }

        filteredUsers = args.users;
        args.users = args.users.concat(settingsModel.dataValues.blacklistedUsers);
      }
    }

    await Bastion.database.models.settings.update({
      blacklistedUsers: args.users
    },
    {
      where: {
        botID: Bastion.user.id
      },
      fields: [ 'blacklistedUsers' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: title,
        description: filteredUsers ? filteredUsers.join(', ') : args.users.join(' ')
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
  enabled: true,
  argsDefinitions: [
    { name: 'users', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, defaultValue: false }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'blacklist',
  description: 'Adds/Removes a specified user to %bastion%\'s blacklist. Blacklisted users cannot use any of %bastion%\'s commands.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'blacklist <USER_ID> [--remove]',
  example: [ 'blacklist @user#001 224433119988776655', 'blacklist @user#001 --remove' ]
};
