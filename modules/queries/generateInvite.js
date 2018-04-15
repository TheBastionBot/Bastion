/**
 * @file generateInvite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let invite = await message.channel.createInvite({
      maxAge: args.age * 60,
      maxUses: args.uses
    });

    message.channel.send('Hello. Beep. Boop.\n'
      + 'If you wanna invite friends to this server, share the following invite'
      + ' link with your friends.\nBeep!\n' +
      `https://discord.gg/${invite.code}`).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'uses', type: Number, alias: 'u', defaultValue: 3 },
    { name: 'age', type: Number, alias: 'a', defaultValue: 1440 }
  ]
};

exports.help = {
  name: 'generateInvite',
  botPermission: 'CREATE_INSTANT_INVITE',
  userTextPermission: 'CREATE_INSTANT_INVITE',
  userVoicePermission: '',
  usage: 'generateInvite [-u <NO_OF_USES>] [-a <INVITE_LINK_TIMEOUT_IN_MINUTES>]',
  example: [ 'generateInvite', 'generateInvite -u 1 -a 10' ]
};
