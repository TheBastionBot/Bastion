/**
 * @file garfield command
 * @author Freako#4817 (249044688571465729)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let lastDate = Date.now() - 86400000;
  let startDate = 267062400000;
  let comicDate = new Date(Bastion.functions.getRandomInt(startDate, lastDate));

  let year = comicDate.getUTCFullYear();
  let month = comicDate.getUTCMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date = comicDate.getUTCDate();
  if (date < 10) {
    month = `0${date}`;
  }

  message.channel.send({
    files: [ `https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/${year}/${year}-${month}-${date}.gif` ]
  }).catch(e => {
    if (e.status === 404) {
      return Bastion.emit('error', '', 'I\'m sorry. I was unable to react Garfield at that moment. Could you try again?', message.channel);
    }
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'garfield',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'garfield',
  example: []
};
