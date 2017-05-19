/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message) => {
  message.channel.send({embed: {
    color: Bastion.colors.blue,
    description: 'What the heck did you just hecking say about me, you little bitch? I\'ll have you know I graduated top of my class of Shadow School, and I\'m a certified Edgelord, and I have over 300 confirmed suicide attempts. I am trained in passive aggressive warfare and I\'m the top edger in the entire world. You are nothing to me but just another therapist. I will wipe the heck out of myself with precision the likes of which has never been seen before below this Earth, mark my hecking words. You think you can get away with helping me over the Internet? Think again, meddler. As we speak I am contacting my secret network of Edgelords across the underworld and your support group is being edged right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing I call my life. I\'m hecking dead, kid. I can be anywhere, anytime, and I can kill myself in over seven hundred ways, and that\'s just with my bare hands. Not only am I extensively trained in unarmed suicide, but I have access to the entire arsenal of the ropestore and I will use it to its full extent to wipe my miserable ass off the face of the continent, because I\'m a little shit. If only you could have known what unholy retribution your little "supportive" comment was about to bring down upon me, maybe you would have held your hecking tongue. But you couldn\'t, you didn\'t, and now I\'m paying the price, you goddamn idiot. I will shit guilt all over you and I will drown in it. I\'m fucking dead, kiddo.'
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['edgy'],
  enabled: true
};

exports.help = {
  name: 'edgelord',
  description: 'Shows an awesome message from an edgelord!',
  botPermission: '',
  userPermission: '',
  usage: 'edgeLord',
  example: []
};
