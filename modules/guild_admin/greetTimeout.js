/**
 * @file greetTimeout command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  if (!/^(([0-2]?[0-9]?[0-9])|300)$/.test(args[0])) {
    args[0] = '0';
  }
  sql.run(`UPDATE guildSettings SET greetTimeout=${args[0]} WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e.stack);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'Greet Timeout set to:',
      description: args[0] > 60 ? `${args[0] / 60} min.` : args[0] === 0 ? '∞' : `${args[0]} sec.`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'gtout' ],
  enabled: true
};

exports.help = {
  name: 'greettimeout',
  description: 'Sets the time (in seconds) after which greeting message will be automatically deleted. Supported values: 1 - 300. Any value except the supported values will turn off automatic deletion.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetTimeout [time_in_seconds]',
  example: [ 'greetTimeout 120', 'greetTimeout' ]
};
