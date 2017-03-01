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

const loadEvent = event => require(`../events/${event}`);

module.exports = Bastion => {
  Bastion.on('channelCreate', loadEvent('channelCreate'));
  Bastion.on('channelDelete', loadEvent('channelDelete'));
  Bastion.on('channelUpdate', loadEvent('channelUpdate'));
  Bastion.on('disconnect', () => loadEvent('disconnect')(Bastion));
  Bastion.on('error', loadEvent('error'));
  Bastion.on('guildBanAdd', loadEvent('guildBanAdd'));
  Bastion.on('guildBanRemove', loadEvent('guildBanRemove'));
  Bastion.on('guildCreate', loadEvent('guildCreate'));
  Bastion.on('guildDelete', loadEvent('guildDelete'));
  Bastion.on('guildMemberAdd', loadEvent('guildMemberAdd'));
  Bastion.on('guildMemberRemove', loadEvent('guildMemberRemove'));
  Bastion.on('guildUpdate', loadEvent('guildUpdate'));
  Bastion.on('message', loadEvent('message'));
  Bastion.on('messageUpdate', loadEvent('messageUpdate'));
  Bastion.on('ready', () => loadEvent('ready')(Bastion));
  Bastion.on('reconnecting', () => loadEvent('reconnecting')(Bastion));
  Bastion.on('warn', loadEvent('warn'));
};
