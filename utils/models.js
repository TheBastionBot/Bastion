/**
 * @file models
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const logger = require('../handlers/logHandler');
const { prefix } = require('../settings/config.json');

module.exports = (Sequelize, database) => {
  // Models
  database.define('settings', {
    botID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    blacklistedGuilds: {
      type: Sequelize.JSON
    },
    blacklistedUsers: {
      type: Sequelize.JSON
    }
  });

  const Guild = database.define('guild', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    prefix: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: prefix ? [].concat(prefix) : [ '!' ]
    },
    language: {
      type: Sequelize.STRING,
      defaultValue: 'en'
    },
    greet: {
      type: Sequelize.STRING
    },
    greetMessage: {
      type: Sequelize.BLOB
    },
    greetTimeout: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    greetPrivate: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    greetPrivateMessage: {
      type: Sequelize.BLOB
    },
    farewell: {
      type: Sequelize.STRING
    },
    farewellMessage: {
      type: Sequelize.BLOB
    },
    farewellTimeout: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    music: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    chat: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    levelUps: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    levelUpMessages: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    musicTextChannels: {
      type: Sequelize.TEXT,
      unique: true
    },
    musicVoiceChannel: {
      type: Sequelize.STRING,
      unique: true
    },
    musicMasterRole: {
      type: Sequelize.STRING,
      unique: true
    },
    autoAssignableRoles: {
      type: Sequelize.JSON,
      unique: true
    },
    selfAssignableRoles: {
      type: Sequelize.JSON,
      unique: true
    },
    streamerRole: {
      type: Sequelize.STRING,
      unique: true
    },
    filterInvites: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    filterLinks: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    filterMentions: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    filterWords: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    filteredWords: {
      type: Sequelize.JSON
    },
    whitelistedDomains: {
      type: Sequelize.JSON
    },
    whitelistedInvites: {
      type: Sequelize.JSON
    },
    slowMode: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    mentionSpamThreshold: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    mentionSpamAction: {
      type: Sequelize.STRING
    },
    warnThreshold: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    warnAction: {
      type: Sequelize.STRING
    },
    serverLog: {
      type: Sequelize.STRING,
      unique: true
    },
    moderationLog: {
      type: Sequelize.STRING,
      unique: true
    },
    moderationCaseNo: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 1
    },
    starboard: {
      type: Sequelize.STRING,
      unique: true
    },
    announcementChannel: {
      type: Sequelize.STRING,
      unique: true
    },
    reportChannel: {
      type: Sequelize.STRING
    },
    suggestionChannel: {
      type: Sequelize.STRING
    },
    disabledCommands: {
      type: Sequelize.JSON
    },
    onlyMembersWithRoles: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    autoDeleteCommandOutput: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  const User = database.define('user', {
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    bio: {
      type: Sequelize.BLOB
    },
    birthDate: {
      type: Sequelize.DATEONLY
    },
    location: {
      type: Sequelize.STRING
    },
    blacklisted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  const GuildMember = database.define('guildMember', {
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'guildMember'
    },
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'guildMember'
    },
    bastionCurrencies: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '0'
    },
    experiencePoints: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '0'
    },
    level: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '0'
    },
    reputations: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '0'
    },
    blacklisted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastClaimed: {
      type: Sequelize.DATE
    },
    claimStreak: {
      type: Sequelize.TINYINT(3),
      defaultValue: 0
    }
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        await User.upsert({
          userID: user.dataValues.userID
        },
        {
          where: {
            userID: user.dataValues.userID
          },
          fields: [ 'userID' ]
        }).catch(e => {
          logger.error(e);
        });
      },
      afterDestroy: async (user) => {
        try {
          let guildMemberModel = await GuildMember.findOne({
            where: {
              userID: user.dataValues.userID
            }
          });

          // If the user is not present in any guild, remove all user data.
          if (!guildMemberModel) {
            await User.destroy({
              where: {
                userID: user.dataValues.userID
              }
            });
          }
        }
        catch (e) {
          logger.error(e);
        }
      }
    }
  });

  const TextChannel = database.define('textChannel', {
    channelID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: 'guildTextChannel'
    },
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'guildTextChannel'
    },
    votingChannel: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreInviteFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreLinkFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreMentionFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreWordFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreSlowMode: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreStarboard: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disabledCommands: {
      type: Sequelize.JSON
    },
    blacklisted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  const Role = database.define('role', {
    roleID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: 'role'
    },
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'role'
    },
    ignoreInviteFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreLinkFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreMentionFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreWordFilter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreSlowMode: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ignoreStarboard: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disabledCommands: {
      type: Sequelize.JSON
    },
    level: {
      type: Sequelize.STRING
    },
    blacklisted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  const ModerationCase = database.define('moderationCase', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    messageID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });

  const Trigger = database.define('trigger', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    trigger: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    responseMessage: {
      type: Sequelize.TEXT
    },
    responseReactions: {
      type: Sequelize.TEXT
    }
  },
  {
    validate: {
      atLeastOne() {
        if ((this.responseMessage === null) && (this.responseReactions === null)) {
          throw new Error('At least one response type (message/reaction) is required.');
        }
      }
    }
  });

  const ScheduledCommand = database.define('scheduledCommand', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    channelID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    messageID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cronExp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    command: {
      type: Sequelize.STRING,
      allowNull: false
    },
    arguments: {
      type: Sequelize.TEXT
    }
  });

  const Shop = database.define('shop', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    roles: {
      type: Sequelize.JSON
    },
    custom: {
      type: Sequelize.JSON
    }
  });

  const Streamers = database.define('streamers', {
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    channelID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    mixer: {
      type: Sequelize.JSON
    },
    twitch: {
      type: Sequelize.JSON
    },
    youtube: {
      type: Sequelize.JSON
    }
  });

  const Transaction = database.define('transaction', {
    userID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    guildID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    note: {
      type: Sequelize.TEXT
    }
  });

  const Items = database.define('items', {
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'guildMember'
    },
    guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'guildMember'
    },
    custom: {
      type: Sequelize.JSON
    }
  });

  // Associations
  Guild.Items = Guild.hasMany(Items, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.ModerationCases = Guild.hasMany(ModerationCase, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.Roles = Guild.hasMany(Role, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.ScheduledCommands = Guild.hasMany(ScheduledCommand, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.Shop = Guild.hasOne(Shop, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.Streamers = Guild.hasOne(Streamers, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.TextChannels = Guild.hasMany(TextChannel, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.Transactions = Guild.hasMany(Transaction, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Guild.Triggers = Guild.hasMany(Trigger, {
    foreignKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  User.Items = User.hasMany(Items, {
    foreignKey: 'userID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  User.Transactions = User.hasMany(Transaction, {
    foreignKey: 'userID',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  });
  User.Guild = User.belongsToMany(Guild, {
    through: 'guildMember',
    foreignKey: 'userID',
    otherKey: 'guildID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Save (sync) models to database.
  database.sync();

  // Return models
  return database.models;
};
