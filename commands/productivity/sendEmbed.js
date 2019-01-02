/**
 * @file sendEmbed command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = JSON.parse(args.join(' '));
  args.footer = {
    text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : Bastion.i18n.info(message.guild.language, 'endorsementMessage')}`
  };

  await message.channel.send({
    embed: args
  });

  if (message.deletable) await message.delete().catch(() => {});
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendEmbed',
  description: 'Sends an embed message from the specified embed (JavaScript) object. *To create an embed object, graphically, [click here](%website%/embedbuilder/).*',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
