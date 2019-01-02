/**
 * @file garfield command
 * @author Freako#4817 (249044688571465729)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let lastDate = Date.now() - 86400000;
  let startDate = 267062400000;
  let comicDate = new Date(Bastion.methods.getRandomInt(startDate, lastDate));

  let year = comicDate.getUTCFullYear();
  let month = comicDate.getUTCMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date = comicDate.getUTCDate();
  if (date < 10) {
    month = `0${date}`;
  }

  await message.channel.send({
    files: [ `https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/${year}/${year}-${month}-${date}.gif` ]
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'garfield',
  description: 'Shows you a Garfield comic.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'garfield',
  example: []
};
