/**
 * @file leaderboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let profiles = await Bastion.db.all('SELECT userID, bastionCurrencies FROM profiles ORDER BY bastionCurrencies * 1 DESC');

    let fields = [];

    if (!args.global) {
      profiles = profiles.filter(async p => await message.guild.fetchMember(p.userID).catch(() => {}));
    }
    profiles = profiles.slice(0, 10);

    for (let i = 0; i < profiles.length; i++) {
      let user;
      if (message.guild.members.has(profiles[i].userID)) {
        let member = await message.guild.fetchMember(profiles[i].userID);
        user = member.user.tag;
      }
      else {
        user = profiles[i].userID;
      }
      fields.push({
        name: `${i + 1}. ${user}`,
        value: `${profiles[i].bastionCurrencies} Bastion Currencies`,
        inline: true
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Leaderboard',
        description: `Top ${profiles.length} users with highest Bastion Currencies`,
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
  aliases: [ 'lb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'global', type: Boolean, alias: 'g' }
  ]
};

exports.help = {
  name: 'leaderboard',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [--global]',
  example: [ 'leaderboard', 'leaderboard --global' ]
};
