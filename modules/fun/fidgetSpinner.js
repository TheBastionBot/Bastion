/**
 * @file fidgetSpinner command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let spinning = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: `${message.author.tag} is spinning a fidget spinner...`,
        image: {
          url: 'https://i.imgur.com/KJJxVi4.gif'
        }
      }
    });

    let timeout = (Math.random() * (60 - 5 + 1)) + 5;
    setTimeout(() => {
      spinning.edit({
        embed: {
          color: Bastion.colors.BLUE,
          description: `${message.author.tag}, you spinned the fidget spinner for ${timeout.toFixed(2)} seconds.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }, timeout * 1000);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'fidget' ],
  enabled: true
};

exports.help = {
  name: 'fidgetSpinner',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fidgetSpinner',
  example: []
};
