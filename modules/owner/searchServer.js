/**
 * @file searchServer command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (args.length < 1) {
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

  let guilds = Bastion.guilds.filter(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())).map(g => g.name);
  let total = guilds.length;
  guilds = total > 0 ? guilds.slice(0, 10).join(', ') : 'None';

  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      title: 'Server search',
      description: `Found **${total}** servers with **${args.join(' ')}** in it's name.`,
      fields: [
        {
          name: 'Servers',
          value: total > 10 ? `and ${total - 10} more.` : guilds
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'servers' ],
  enabled: true
};

exports.help = {
  name: 'searchserver',
  description: 'Searches for servers, by specified text, the bot is connected to.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'searchServer <name>',
  example: [ 'searchServer Bastion' ]
};
