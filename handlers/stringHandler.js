const Locke = require('locke');

const StringHandler = class StringHandler extends Locke {
  /**
   * Returns a event name for the specified event key in the specified locale.
   * @method event
   * @param {String} locale The locale of the event name to get.
   * @param {String} event The event key of the event name to get.
   * @returns {String} The event name for the specified key in the specified
   * language.
   */
  event(locale, event) {
    return super._getString('event', locale, event);
  }
};

module.exports = StringHandler;
