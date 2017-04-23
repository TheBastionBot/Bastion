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

const color = require('chalk');

module.exports = Bastion => {
  Bastion.log = {};

  Bastion.log.warn = msg => {
    console.log(color.yellow('[WARNING]'));
    console.log(msg);
    console.log(color.yellow('[/WARNING]'));
  };
  Bastion.log.error = msg => {
    console.log(color.red('[ERROR]'));
    console.log(msg);
    console.trace();
    console.log(color.red('[/ERROR]'));
  };
  Bastion.log.msg = msg => {
    console.log(color.cyan('[Bastion]: ') + `${msg}`);
  }
  Bastion.log.info = msg => {
    console.log(color.cyan('[Bastion]: ') + color.yellow(msg));
  }
};
