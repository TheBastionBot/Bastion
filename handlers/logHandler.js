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

 /* eslint-disable no-console*/

const COLOR = require('chalk');

module.exports = Bastion => {
  Bastion.log = {};

  Bastion.log.warn = (...message) => {
    console.log(COLOR.yellow('[WARNING]'));
    console.warn(...message);
    console.log(COLOR.yellow('[/WARNING]'));
  };

  Bastion.log.error = (...message) => {
    console.log(COLOR.red('[ERROR]'));
    console.log(...message);
    console.trace();
    console.log(COLOR.red('[/ERROR]'));
  };

  Bastion.log.info = (...message) => {
    console.log(COLOR.cyan('[Bastion]: ') + COLOR.yellow(...message));
  };

  Bastion.log.message = message => {
    console.log(COLOR.cyan('[Bastion]: ') + message);
  };

  Bastion.log.console = (...message) => {
    console.log(...message);
  };
};
