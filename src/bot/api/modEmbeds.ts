/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { GuildChannel, GuildMember, Invite, Message, MessageEmbed, Webhook } from 'discord.js';


async function modadd(member: GuildMember, webhook: Webhook): Promise<(Message | Object)> {
    const modad = new MessageEmbed()
        .setTitle(`📡 Mod Log!!!`)
        .setColor('GREEN')
        .setDescription(`📥 New Member Joined`)
        .setThumbnail(member.user.displayAvatarURL({
            dynamic: true
        }))
        .setAuthor(`${member.user.tag}`)
        .addField(`Account Age`, `<t:${Math.floor(member.joinedTimestamp! / 1000)}:f>`, true)
        .addField(`Bot`, `${member.user.bot}`, true)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();

    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Guild Member Add 📬',
        embeds: [modad],
    })
}

async function modmsgedit(oldmsg: Message, newmsg: Message, webhook: Webhook): Promise<(Message | Object)> {
    const msgedited1 = new MessageEmbed()
        .setTitle(`📡 Mod Log!!!`)
        .setColor('RED')
        .setFooter(`ID: ${oldmsg.author.id} | Message Id: ${oldmsg.id} | Original Message`)
        .setTimestamp()
        .setThumbnail(oldmsg.author.displayAvatarURL({
            dynamic: true
        }))
        .setAuthor(`${oldmsg.author.tag}`, 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png', `https://discord.com/channels/${oldmsg.guild?.id}/${oldmsg.channel.id}/${oldmsg.id}`)
        .setDescription(oldmsg.content)
        .addField('Channel', `${oldmsg.channel}`, true)
        .addField(`Message Created Timestamp`, `<t:${Math.round(oldmsg.createdTimestamp / 1000)}:f>`, true)
        .setURL(`https://discord.com/channels/${oldmsg.guild?.id}/${oldmsg.channel.id}/${oldmsg.id}`)
    const msgedited2 = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`📡 Mod Log!!!`)
        .setFooter(`ID: ${newmsg.author ? newmsg.author.id : 'Not Cached'} | Message Id: ${newmsg.id} | Edited Message`)
        .setTimestamp()
        .setThumbnail(newmsg.author ? newmsg.author.displayAvatarURL({
            dynamic: true
        }) : 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png')
        .addField(`Message Edited Timestamp`, `<t:${Math.round(newmsg.editedTimestamp! / 1000)}:f>`, true)
        .setAuthor(`${newmsg.author ? newmsg.author.tag : 'Not Cached'}`, 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png', `https://discord.com/channels/${newmsg.guild?.id}/${newmsg.channel.id}/${newmsg.id}`)
        .setDescription(newmsg.content)
        .addField('Channel', `${newmsg.channel}`, true)
    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Message Edit Event 📬',
        embeds: [msgedited1, msgedited2],
    })
}

async function modmsgdel(message: Message, webhook: Webhook): Promise<(Message | Object)> {
    const moddel = new MessageEmbed()
        .setTitle(`📡 Mod Log!!!`)
        .setColor('RED')
        .setDescription(message.content)
        .setThumbnail(message.author ? message.author.displayAvatarURL({
            dynamic: true
        }) : 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png')
        .setAuthor(`${message.author ? message.author.tag : `Not Cached`}`)
        .addField(`Message Timestamp`, `<t:${Math.round(message.createdTimestamp / 1000)}:f>`, true)
        .addField(`Bot`, `${message.author ? message.author.bot : 'Not Cached'}`, true)
        .addField(`Channel`, `${message.channel}`, true)
        .setFooter(`ID: ${message.author ? message.author.id : 'Not Cached'} | Message ID: ${message.id} | Message Deleted`)
        .setTimestamp();

    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Message Delete 📬',
        embeds: [moddel],
    })
}

async function modbulkdel(array: Message[], webhook: Webhook): Promise<(Message | Object)> {
    const modbulkde = new MessageEmbed()
        .setColor(`RED`)
        .setAuthor(`Too Many Messages Deleted`)
        .setTitle(`📡 Mod Log!!!`)
        .setThumbnail(array[0].author ? array[0].author.displayAvatarURL({
            dynamic: true
        }) : 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png')
        .addField(`Messages Deleted`, `${array.length}`, true)
        .addField(`Channel`, `${array[0].channel}`, true)
        .setFooter(`Message Bulk Delete`)

    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Message Bulk Delete 📬',
        embeds: [modbulkde],
    })
}

async function modinvdel(invite: Invite, webhook: Webhook): Promise<(Message | Object)> {
    const modinvd = new MessageEmbed()
        .setColor(`RED`)
        .setAuthor(`Invite Delete`)
        .setTitle(`📡 Mod Log!!!`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/831552576180322305/843428642817835008/oqH0Wnw.png`)
        .setDescription(`The presence type is ${invite.presenceCount ? invite.presenceCount : 'Null'}. The member count is ${invite.memberCount ? invite.memberCount : '0'} and the invite is ${invite.temporary ? invite.temporary : 'Permenent Or idk'}.\nTarget user was ${invite.targetUser ? invite.targetUser : 'No One'}.`)
        .addField('Code', `${invite.code}`, true)
        .addField('Channel', `${invite.channel ? invite.channel : 'No Channel'}`, true)
        .addField('Invite Creator', `${invite.inviter ? invite.inviter.tag : 'Null'}`, true)
        .setFooter(`Invite Delete`)
    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Invite Delete 📬',
        embeds: [modinvd],
    })
}

async function modinvcre(invite: Invite, webhook: Webhook): Promise<(Message | Object)> {
    const modinvcr = new MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(`Invite Created`)
        .setTitle(`📡 Mod Log!!!`)
        .setThumbnail(invite.inviter ? invite.inviter.displayAvatarURL({ dynamic: true }) : 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png')
        .setDescription(`The presence type is ${invite.presenceCount ? invite.presenceCount : 'Null'}. The member count is ${invite.memberCount ? invite.memberCount : '0'} and the invite is ${invite.temporary ? invite.temporary : 'Permenent Or idk'}.\nTarget user was ${invite.targetUser ? invite.targetUser : 'No One'}.`)
        .addField('Code', `${invite.code}`, true)
        .addField('Channel', `${invite.channel ? invite.channel : 'No Channel'}`, true)
        .addField('Invite Creator', `${invite.inviter ? invite.inviter.tag : 'Null'}`, true)
        .setFooter(`Invite Created`)
    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Invite Created 📬',
        embeds: [modinvcr],
    })
}

async function modchancre(channel: GuildChannel, webhook: Webhook): Promise<(Message | Object)> {
    const modchancr = new MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(`Channel Created`)
        .setTitle(`📡 Mod Log!!!`)
        .setThumbnail(channel.guild ? String(channel.guild.iconURL()) : 'https://cdn.discordapp.com/attachments/815589214057529345/851385503822905354/9ed91074a5368ad9b394081408c3963e.png')
        .setDescription(`The channel type is ${channel.type} and the name is set to ${channel.name}. The Position of the channel is ${channel.rawPosition} and the parent is ${channel.parentId}`)
        .addField(`Channel Linked`, `<#${channel.id}>`, true)
        .addField(`Channel Id`, `${channel.id}`, true)
        .setFooter(`Channel Create`)
        .setTimestamp()

    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Channel Created 📬',
        embeds: [modchancr],
    })
}

async function modchandel(channel: GuildChannel, webhook: Webhook): Promise<(Message | Object)> {
    const modchande = new MessageEmbed()
        .setColor(`RED`)
        .setAuthor(`Channel Delete`)
        .setTitle(`📡 Mod Log!!!`)
        .setThumbnail(String(channel.guild.iconURL()))
        .setDescription(`The channel type is ${channel.type} and the name is set to ${channel.name}. The Position of the channel is ${channel.rawPosition} and the parent is ${channel.parentId}`)
        .addField(`Channel Id`, `${channel.id}`, true)
        .setFooter(`Channel Delete`)

    return await webhook.send({
        username: 'Shizu Logger',
        avatarURL: 'https://cdn.discordapp.com/attachments/831552576180322305/842417854485495838/screen-2.png',
        content: '📨 Channel Deleted 📬',
        embeds: [modchande],
    })
}
export {
    modadd,
    modmsgedit,
    modmsgdel,
    modbulkdel,
    modinvdel,
    modinvcre,
    modchancre,
    modchandel
}