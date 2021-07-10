// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-case-declarations */
// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import Event from '../../struct/Event';
// import { MessageEmbed, GuildMember, TextChannel } from 'discord.js';
// import { welcome as welcomeschema } from '../../mongoose/schemas/welcome';
// abstract class GuildMemberAddEvent extends Event {
//     constructor() {
//         super({
//             name: 'guildMemberAdd',
//         });
//     }

//     public async exec(member: GuildMember) {
//         if (member.user.bot) return;
//         const {
//             guild
//         } = member
//         const data = await welcomeschema.findOne({
//             guildId: guild.id
//         })
//         if (!data) return;
//         switch (data.dmchan) {
//             case "dm":
//                 const welcomedm = new MessageEmbed()
//                     .setTitle(`Welcome message from **__${guild.name}__**`)
//                     .setDescription(data.message)
//                     .setColor(data.color)
//                     .setImage(`https://cdn.discordapp.com/attachments/831552576180322305/832501466735706122/wp5567600-anime-ps4-banner-4k-wallpapers.jpg`)
//                     .setThumbnail(guild.iconURL({
//                         dynamic: true
//                     })!)
//                     .setTimestamp();
//                 await member.send({ embeds: [welcomedm] }).catch(() => {
//                     return;
//                 });
//                 break;
//             case "channel":
//                 const ch = guild.channels.cache.get(`${BigInt(data.channelId)}`) as TextChannel
//                 if (!ch) {
//                     await welcomeschema.findOneAndRemove({
//                         guildId: guild.id
//                     })
//                     const owner = await guild.fetchOwner()
//                     await owner.user.send({
//                         content: `I wasnt able to get a channel with the id ${data.channelId} for the welcome message\nI have **reset** the welcome message`
//                     }).catch(() => {
//                         return;
//                     })
//                     return
//                 }
//                 const welcomech = new MessageEmbed()
//                     .setTitle(`Welcome message from **__${guild.name}__**`)
//                     .setDescription(data.message)
//                     .setColor(data.color)
//                     .setImage(`https://cdn.discordapp.com/attachments/831552576180322305/832501466735706122/wp5567600-anime-ps4-banner-4k-wallpapers.jpg`)
//                     .setThumbnail(member.user.displayAvatarURL({
//                         dynamic: true
//                     }))
//                     .setTimestamp();
//                 await ch.send({ embeds: [welcomech] }).catch(async () => {
//                     await welcomeschema.findOneAndRemove({
//                         guildId: guild.id
//                     })
//                     return;
//                 })
//                 break;
//             case "both":
//                 const bch = guild.channels.cache.get(`${BigInt(data.channelId)}`) as TextChannel
//                 if (!bch) {
//                     await welcomeschema.findOneAndRemove({
//                         guildId: guild.id
//                     })
//                     const owner = await guild.fetchOwner()
//                     await owner.user.send({
//                         content: `I wasnt able to get a channel with the id ${data.channelId} for the welcome message\nI have **reset** the welcome message`
//                     }).catch(() => {
//                         return;
//                     })
//                     return
//                 }
//                 const bwelcomech = new MessageEmbed()
//                     .setTitle(`Welcome message from **__${guild.name}__**`)
//                     .setDescription(trim(data.message))
//                     .setColor(data.color)
//                     .setImage(`https://cdn.discordapp.com/attachments/831552576180322305/832501466735706122/wp5567600-anime-ps4-banner-4k-wallpapers.jpg`)
//                     .setThumbnail(guild.iconURL({
//                         dynamic: true
//                     })!)
//                     .setTimestamp();
//                 const bcwelcomech = new MessageEmbed()
//                     .setTitle(`Welcome message from **__${guild.name}__**`)
//                     .setDescription(trim(data.message))
//                     .setColor(data.color)
//                     .setImage(`https://cdn.discordapp.com/attachments/831552576180322305/832501466735706122/wp5567600-anime-ps4-banner-4k-wallpapers.jpg`)
//                     .setThumbnail(member.user.displayAvatarURL({
//                         dynamic: true
//                     }))
//                     .setTimestamp();
//                 await bch.send({ embeds: [bcwelcomech] }).catch(async () => {
//                     await welcomeschema.findOneAndRemove({
//                         guildId: guild.id
//                     })
//                     return;
//                 })
//                 await member.user.send({ embeds: [bwelcomech] }).catch(() => {
//                     return;
//                 })
//         }
//     }
// }

// export default GuildMemberAddEvent;

// function trim(input: string): string {
//     return input.length > 2000 ? `${input.slice(0, 2000)} ...` : input;
// }