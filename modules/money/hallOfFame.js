/**
 * @file hallOfFame command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let profiles = await Bastion.db.all('SELECT userID, xp, level FROM profiles ORDER BY level * 1 DESC, xp * 1 DESC');

    let fields = [];

    if (!args.global) {
      profiles = profiles.filter(p => message.guild.members.get(p.userID));
    }
    profiles = profiles.slice(0, 10);

    for (let i = 0; i < profiles.length; i++) {
      let user = message.guild.members.map(m => m.id).includes(profiles[i].userID) ? message.guild.members.get(profiles[i].userID).user.tag : profiles[i].userID;
      fields.push({
        name: `${i + 1}. ${user}`,
        value: `Level: ${profiles[i].level}\tExperience Points: ${profiles[i].xp}`,
        inline: true
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Hall of Fame',
        description: `Top ${profiles.length} users with highest Level & Experience Points`,
        fields: fields
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'hof' ],
  enabled: true,
  argsDefinitions: [
    { name: 'global', type: Boolean, alias: 'g' }
  ]
};

exports.help = {
  name: 'hallOfFame',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'hallOfFame [--global]',
  example: [ 'hallOfFame', 'hallOfFame --global' ]
};
