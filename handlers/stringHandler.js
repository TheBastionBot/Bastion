/**
 * @file stringHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Locke = xrequire('locke');

const StringHandler = class StringHandler extends Locke {
  /**
   * Returns an event name for the specified event key in the specified locale.
   * @method event
   * @param {String} locale The locale of the event name to get.
   * @param {String} event The event key of the event name to get.
   * @returns {String} The event name for the specified key in the specified
   * language.
   */
  event(locale, event) {
    return super._getString('event', locale, event);
  }

  /**
   * Returns the command info for the specified command in the specified locale.
   * @method command
   * @param {String} locale The locale of the command info to get.
   * @param {String} command The command name for which info is to be returned.
   * @returns {String} The command info for the specified command in the
   * specified language.
   */
  command(locale, command) {
    if (!this._strings.has(locale)) locale = this._defaultLocale;

    if (!this._strings.get(locale)['command'] || !this._strings.get(locale)['command'].hasOwnProperty(command)) {
      if (locale === this._defaultLocale) {
        return `No string found for the '${command}' key.`;
      }
      return this.command(this._defaultLocale, command);
    }

    let commandInfo = this._strings.get(locale)['command'][command];

    if (this._constantsRegExp && commandInfo.description) {
      commandInfo.description = commandInfo.description.replace(this._constantsRegExp, matched => this._constants[matched]);
    }
    return commandInfo;
  }
};

module.exports = StringHandler;
