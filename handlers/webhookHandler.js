/**
 * @file webhookHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Discord = require('discord.js');

module.exports = class WebhookHandler {
  /**
   * Handles the webhooks sent by Bastion.
   * @constructor
   * @param {Object} webhooks The webhooks object in the `credentials.json` file.
   */
  constructor(webhooks) {
    if (!webhooks) return null;
    this.webhooks = [];
    for (let hook of Object.keys(webhooks)) {
      this.webhooks.push(hook);
      let webhookCredentials = webhooks[hook].split('/').slice(-2);
      this[hook] = {
        url: webhooks[hook],
        id: webhookCredentials[0],
        token: webhookCredentials[1]
      };
      this[hook].client = new Discord.WebhookClient(this[hook].id, this[hook].token);
    }
  }

  /**
   * Sends the specified message as a webhook to the specified webhook channel.
   * @function send
   * @param {String} webhook The name of the webhook where the message is to be sent.
   * @param {String|Number|Object} content The message content to send with the webhook. A string, number or Discord.js embed object.
   * @returns {void}
   */
  send(webhook, content) {
    if (this.webhooks && this.webhooks.includes(webhook)) {
      if (typeof content === 'object' && !(content instanceof Array)) {
        content = {
          embeds: [ content ]
        };
      }
      if (content) {
        this[webhook].client.send(content).catch(() => {});
      }
    }
  }
};
