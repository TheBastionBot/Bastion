/**
 * @file deleteTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args[0]) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await Bastion.database.models.trigger.destroy({
    where: {
      trigger: args.join(' '),
      guildID: message.guild.id
    }
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      title: 'Trigger deleted',
      description: args.join(' ')
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true
};

exports.help = {
  name: 'deleteTrigger',
  description: 'Deletes the specified message trigger.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
