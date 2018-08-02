/**
 * @file listServers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
  let guilds = Array.from(Bastion.guilds.values());

  let totalGuilds = guilds.length;
  let noOfPages = totalGuilds / 2;
  let p = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  p = p - 1;

  guilds = guilds.slice(p * 2, (p * 2) + 2);

  let fields = [];
  for (let i = 0; i < guilds.length; i++) {
    fields.push({
      name: guilds[i].name,
      value: guilds[i].id
    });
  }


  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Server List',
      description: `Bastion is connected to **${totalGuilds}** servers${Bastion.shard ? `, in Shard ${Bastion.shard.id}` : ''}.`,
      fields: fields,
      footer: {
        text: `Page: ${p + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'servers' ],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listServers',
  description: 'Lists all Discord servers that Bastion is connected to, in the current shard.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listServers [PAGE_NO]',
  example: [ 'listServers 2' ]
};
