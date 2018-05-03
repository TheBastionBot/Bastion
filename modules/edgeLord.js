/**
 * @file edgeLord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      description: 'What the heck did you just hecking say about me,' +
                   'you little bitch? I\'ll have you know I graduated top ' +
                   'of my class of Shadow School, and I\'m a certified ' +
                   'Edgelord, and I have over 300 confirmed suicide attempts.' +
                   ' I am trained in passive aggressive warfare and I\'m ' +
                   'the top edger in the entire world. You are nothing to ' +
                   'me but just another therapist. I will wipe the heck out ' +
                   'of myself with precision the likes of which has never ' +
                   'been seen before below this Earth, mark my hecking words.' +
                   ' You think you can get away with helping me over the ' +
                   'Internet? Think again, meddler. As we speak I am ' +
                   'contacting my secret network of Edgelords across the ' +
                   'underworld and your support group is being edged right ' +
                   'now so you better prepare for the storm, maggot. The ' +
                   'storm that wipes out the pathetic little thing I call ' +
                   'my life. I\'m hecking dead, kid. I can be anywhere, ' +
                   'anytime, and I can kill myself in over seven hundred ' +
                   'ways, and that\'s just with my bare hands. Not only am ' +
                   'I extensively trained in unarmed suicide, but I have ' +
                   'access to the entire arsenal of the ropestore and I will ' +
                   'use it to its full extent to wipe my miserable ass off ' +
                   'the face of the continent, because I\'m a little shit. ' +
                   'If only you could have known what unholy retribution ' +
                   'your little "supportive" comment was about to bring down ' +
                   'upon me, maybe you would have held your hecking tongue. ' +
                   'But you couldn\'t, you didn\'t, and now I\'m paying ' +
                   'the price, you goddamn idiot. I will shit guilt all ' +
                   'over you and I will drown in it. I\'m fucking dead, kiddo.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'edgy' ],
  enabled: true
};

exports.help = {
  name: 'edgeLord',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'edgeLord',
  example: []
};
