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

const LOAD_EVENTS = event => require(`../events/${event}`);

module.exports = Bastion => {
  Bastion.on('channelCreate', LOAD_EVENTS('channelCreate'));
  Bastion.on('channelDelete', LOAD_EVENTS('channelDelete'));
  Bastion.on('channelUpdate', LOAD_EVENTS('channelUpdate'));
  Bastion.on('error', LOAD_EVENTS('error'));
  Bastion.on('guildBanAdd', LOAD_EVENTS('guildBanAdd'));
  Bastion.on('guildBanRemove', LOAD_EVENTS('guildBanRemove'));
  Bastion.on('guildCreate', LOAD_EVENTS('guildCreate'));
  Bastion.on('guildDelete', LOAD_EVENTS('guildDelete'));
  Bastion.on('guildMemberAdd', LOAD_EVENTS('guildMemberAdd'));
  Bastion.on('guildMemberRemove', LOAD_EVENTS('guildMemberRemove'));
  Bastion.on('guildUpdate', LOAD_EVENTS('guildUpdate'));
  Bastion.on('message', LOAD_EVENTS('message'));
  Bastion.on('messageUpdate', LOAD_EVENTS('messageUpdate'));
  Bastion.on('ready', () => LOAD_EVENTS('ready')(Bastion));
  Bastion.on('roleCreate', LOAD_EVENTS('roleCreate'));
  Bastion.on('roleDelete', LOAD_EVENTS('roleDelete'));
  Bastion.on('roleUpdate', LOAD_EVENTS('roleUpdate'));
  Bastion.on('warn', LOAD_EVENTS('warn'));
};
