/**
 * @file Event Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Loads the events
 * @function LOAD_EVENTS
 * @param {string} event Name of the event.
 * @returns {function} The event's function.
 */
const LOAD_EVENTS = event => require(`../events/${event}`);

/**
 * Handles/Loads all the events.
 * @module eventHandler
 * @param {object} Bastion The Bastion Object.
 * @returns {void}
 */
module.exports = Bastion => {
  /**
   * Emitted whenever a channel is created.
   * @listens channelCreate
   */
  Bastion.on('channelCreate', LOAD_EVENTS('channelCreate'));
  /**
   * Emitted whenever a channel is deleted.
   * @listens channelDelete
   */
  Bastion.on('channelDelete', LOAD_EVENTS('channelDelete'));
  /**
   * Emitted whenever a channel is updated - e.g. name change, topic change.
   * @listens channelUpdate
   */
  Bastion.on('channelUpdate', LOAD_EVENTS('channelUpdate'));
  /**
   * Emitted whenever Bastion's WebSocket encounters a connection error.
   * Also handles other errors emitted by Bastion.
   * @listens error
   */
  Bastion.on('error', LOAD_EVENTS('error'));
  /**
   * Emitted whenever a member is banned from a guild.
   * @listens guildBanAdd
   */
  Bastion.on('guildBanAdd', LOAD_EVENTS('guildBanAdd'));
  /**
   * Emitted whenever a member is unbanned from a guild.
   * @listens guildBanRemove
   */
  Bastion.on('guildBanRemove', LOAD_EVENTS('guildBanRemove'));
  /**
   * Emitted whenever Bastion joins a guild.
   * @listens guildCreate
   */
  Bastion.on('guildCreate', LOAD_EVENTS('guildCreate'));
  /**
   * Emitted whenever a guild is deleted/left.
   * @listens guildDelete
   */
  Bastion.on('guildDelete', LOAD_EVENTS('guildDelete'));
  /**
   * Emitted whenever a user joins a guild.
   * @listens guildMemberAdd
   */
  Bastion.on('guildMemberAdd', LOAD_EVENTS('guildMemberAdd'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  Bastion.on('guildMemberRemove', LOAD_EVENTS('guildMemberRemove'));
  /**
   * Emitted whenever a member leaves a guild, or is kicked.
   * @listens guildMemberRemove
   */
  Bastion.on('presenceUpdate', LOAD_EVENTS('presenceUpdate'));
  /**
   * Emitted whenever a guild is updated - e.g. name change.
   * @listens guildUpdate
   */
  Bastion.on('guildUpdate', LOAD_EVENTS('guildUpdate'));
  /**
   * Emitted whenever a message is created.
   * @listens message
   */
  Bastion.on('message', LOAD_EVENTS('message'));
  /**
   * Emitted whenever a reaction is added to a message.
   * @listens message
   */
  Bastion.on('messageReactionAdd', LOAD_EVENTS('messageReactionAdd'));
  /**
   * Emitted whenever a message is updated - e.g. embed or content change.
   * @listens messageUpdate
   */
  Bastion.on('messageUpdate', LOAD_EVENTS('messageUpdate'));
  /**
   * Emitted when Bastion becomes ready to start working.
   * @listens ready
   */
  Bastion.on('ready', () => LOAD_EVENTS('ready')(Bastion));
  /**
   * Emitted whenever a role is created.
   * @listens roleCreate
   */
  Bastion.on('roleCreate', LOAD_EVENTS('roleCreate'));
  /**
   * Emitted whenever a guild role is deleted.
   * @listens roleDelete
   */
  Bastion.on('roleDelete', LOAD_EVENTS('roleDelete'));
  /**
   * Emitted whenever a guild role is updated.
   * @listens roleUpdate
   */
  Bastion.on('roleUpdate', LOAD_EVENTS('roleUpdate'));
  /**
   * Emitted for general warnings.
   * @listens warn
   */
  Bastion.on('warn', LOAD_EVENTS('warn'));

  /**
  * Emitted whenever Bastion doesn't have the required permission(s).
  * @listens bastionMissingPermissions
  */
  Bastion.on('bastionMissingPermissions', LOAD_EVENTS('bastionMissingPermissions'));
  /**
   * Emitted whenever a command is used with invalid parameters.
   * @listens commandUsage
   */
  Bastion.on('commandUsage', LOAD_EVENTS('commandUsage'));
  /**
   * Emitted whenever a moderation log event fires.
   * @listens moderationLog
   */
  Bastion.on('moderationLog', LOAD_EVENTS('moderationLog'));
  /**
   * Emitted whenever Bastion Currency is credited from a user.
   * @listens userCredit
   */
  Bastion.on('userCredit', LOAD_EVENTS('userCredit'));
  /**
   * Emitted whenever Bastion Currency is debited to a user.
   * @listens userDebit
   */
  Bastion.on('userDebit', LOAD_EVENTS('userDebit'));
  /**
  * Emitted whenever the user doesn't have the required permission(s) to use a command.
  * @listens userMissingPermissions
  */
  Bastion.on('userMissingPermissions', LOAD_EVENTS('userMissingPermissions'));
};
