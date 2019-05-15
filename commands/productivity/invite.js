/**
 * @file invite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let code = await message.guild.fetchVanityCode().catch(() => {});

  if (!code && message.member.hasPermission('CREATE_INSTANT_INVITE')) {
    let invite = await message.channel.createInvite({
      maxAge: 0,
      maxUses: args.uses
    });
    code = invite.code;
  }

  let inviteMessage = `Hello. Beep. Boop.\n${code
    ? `If you wanna invite friends to this server, share the following invite link with your friends.\nhttps://discord.gg/${code}`
    : 'You don\'t seem to have the permission to invite anyone to this server. You should talk about this to the moderators or the owner.'}`;

  await message.channel.send(inviteMessage);

  if (message.guild.ownerID !== message.author.id) {
    await message.channel.send(
      'And if you wanna invite me to your server, use the following link.\nBeep!\n'
      + '<https://discordapp.com/oauth2/authorize?client_id=267035345537728512&scope=bot&permissions=8>'
    );
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'invite',
  description: 'Shows you a invite links to the server and also shows how to invite Bastion.',
  botPermission: 'CREATE_INSTANT_INVITE',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'invite',
  example: [ 'invite' ]
};
