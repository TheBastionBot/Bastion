/**
 * @file resetDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.profiles) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await Bastion.database.models.guildMember.destroy({
    truncate: true
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'Bastion `profiles` database was successfully reset.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'resetdb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'profiles', type: Boolean, alias: 'p' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'resetDatabase',
  description: 'Resets all the data from a specified table of %bastion%\'s database.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetDatabase < --profiles >',
  example: [ 'resetDatabase --profiles' ]
};
