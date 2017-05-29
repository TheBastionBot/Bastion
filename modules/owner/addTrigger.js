/**
 * @file addTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  args = args.join(' ');
  if (!/.+ << .+/.test(args)) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  args = args.split(' << ');
  sql.run('INSERT INTO triggers (trigger, response) VALUES (?, ?)', [ args[0], args[1] ]).catch(e => {
    Bastion.log.error(e.stack);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'New Trigger Added',
      fields: [
        {
          name: 'Trigger',
          value: args[0]
        },
        {
          name: 'Response',
          value: args[1]
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'addtrip' ],
  enabled: true
};

exports.help = {
  name: 'addtrigger',
  description: 'Adds a trigger with a response message. Separate trigger & message with `<<`.`',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'addTrigger <trigger> << <response>',
  example: [ 'addTrigger Hi, there? << Hello $user! :wave:' ]
};
