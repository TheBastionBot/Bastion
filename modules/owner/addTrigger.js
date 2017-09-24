/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.trigger || !args.triggers.trim().length || !args.response || !args.response.trim().length) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.db.run('INSERT INTO triggers (trigger, response) VALUES (?, ?)', [ args.trigger.join(' '), args.response.join(' ') ]).catch(e => {
    Bastion.log.error(e);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'New Trigger Added',
      fields: [
        {
          name: 'Trigger',
          value: args.trigger.join(' ')
        },
        {
          name: 'Response',
          value: args.response.join(' ')
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'addtrip' ],
  enabled: true,
  argsDefinitions: [
    { name: 'trigger', type: String, alias: 't', multiple: true, defaultOption: true },
    { name: 'response', type: String, alias: 'r', multiple: true }
  ]
};

exports.help = {
  name: 'addTrigger',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'addTrigger <-t trigger message> <-r response message>',
  example: [ 'addTrigger -t Hi, there? -r Hello $user! :wave:' ]
};
