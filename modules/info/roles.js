/**
 * @file roles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let roles = message.guild.roles.filter(r => r.position !== 0).map(r => r.name).map((r, i) => `${i + 1}. ${r}`);

  let i = 0, noOfPages = roles.length / 10;
  if (isNaN(args = parseInt(args[0]))) {
    i = 1;
  }
  else {
    i = (args > 0 && args < noOfPages + 1) ? args : 1;
  }
  i = i - 1;

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Roles',
      description: roles.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'roles',
  description: 'Shows the list of roles in the server.',
  botPermission: '',
  userPermission: '',
  usage: 'roles',
  example: []
};
