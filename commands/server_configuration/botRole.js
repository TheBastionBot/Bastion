/**
 * @file botRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let role = args.role ? message.guild.roles.get(args.role.join('')) : message.mentions.roles.first();
  if (!role && args.role) {
    role = message.guild.roles.find(role => role.name === args.role.join(' '));
  }

  await Bastion.database.models.guild.update({
    botRole: role ? role.id : null
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'botRole' ]
  });

  await message.channel.send({
    embed: {
      color: role ? Bastion.colors.GREEN : Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, role ? 'setBotRole' : 'unsetBotRole', message.author.tag, role)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, alias: 'r', defaultOption: true }
  ]
};

exports.help = {
  name: 'botRole',
  description: 'Sets/unsets the Bot Role in the server. Any bot that joins the server is given this role.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'botRole',
  example: [ 'botRole', 'botRole Bots', 'botRole 239314571642104659' ]
};
