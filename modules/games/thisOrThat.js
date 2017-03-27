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

const getRandomInt = require('../../functions/getRandomInt');
const question = require('../../data/thisOrThat.json');

exports.run = function(Bastion, message, args) {
  let index = getRandomInt(0, Object.keys(question).length - 1);
  message.channel.sendMessage('', {embed: {
    color: 6651610,
    description: question[index]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['thisthat']
};

exports.help = {
  name: 'thisorthat',
  description: 'Asks you a this or that question. Let\'s see how is your choice!',
  permission: '',
  usage: 'thisOrThat',
  example: []
};
