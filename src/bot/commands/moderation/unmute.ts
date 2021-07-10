/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { muteRole as muterolschema } from '../../mongoose/schemas/muterole';
import { mute_Schema as muteschema } from '../../mongoose/schemas/mute';
import Command from '../../struct/Command';
import { Message, MessageEmbed, Role } from 'discord.js';

abstract class MuteCommand extends Command {
    constructor() {
        super({
            name: 'unmute',
            aliases: [],
            description: 'UnMute someone',
            usage: '<prefix>unmute <person> [reason]',
            category: 'mods',
            cooldown: 0,
            ownerOnly: false,
            guildOnly: true,
            requiredArgs: 1,
            userPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
            clientPermissions: ['ADD_REACTIONS', "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES", "MANAGE_ROLES"]
        });
    }

    // tslint:disable-next-line: promise-function-async
    public async exec(message: Message, args: string[]) {
        const staff2 = message.author;
        const target = message.mentions.members?.first() || message.guild?.members.cache.get(`${BigInt(args[0])}`)
        if (!target) return message.reply({
            content: 'Can\'t find specefied member! Provide a valid id'
        });
        if (
            message.member && message.member.roles.highest.position <= target.roles.highest.position
        ) {
            if (message.guild?.ownerId !== message.author.id) return message.reply({
                content: `The targeted Member aka ${target} is your comarade or is higher than you`
            });
        }
        let reason = args.slice(2).join(' ');
        if (!reason) reason = 'triggering the mods';
        const staff = await message.guild?.members.cache.get(`${BigInt(args[1])}`)
        if (!staff) return message.reply({
            content: 'Can\'t find specefied member! Provide a valid id of the staff member'
        });
        const data = await muteschema.findOne({
            userId: target.id,
            guildId: message.guild?.id,
            staffId: staff.id,
        })
        if (data) {

            const mrole = await muterole(message);

            if (!mrole) return message.reply({
                content: `Could\\'nt find the muted role`
            })
            let check3 = false
            target.roles.remove(mrole).catch(() => {
                check3 = true
                return message.reply({
                    content: `Could\\'t remove muted role. Make sure im above that specified role`
                })
            })
            if (check3) return;
            await data.remove()
            const chan = new MessageEmbed()
                .setTitle(`UnMuted`)
                .setColor('GREEN')
                .setDescription(`**Reason**\n${reason}`)
                .addField(`**Staff**`, `${staff2.tag}(${staff2.id})`, true)
                .setThumbnail(`https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`)
                .setImage(target.user.displayAvatarURL({
                    dynamic: true
                }))

            const dm = new MessageEmbed()
                .setTitle(`You are Unmuted in ${message.guild?.name}`)
                .setColor('GREEN')
                .setDescription(`**Reason**\n${reason}`)
                .addField(`**Staff**`, `${staff2.tag}(${staff2.id})`, true)
                .setThumbnail(`https://cdn.discordapp.com/attachments/820856889574293514/836224178305761330/IMG_20210418_030718_152.png`)
                .setImage(message.guild?.iconURL({
                    dynamic: true
                })!)
            target.send({ embeds: [dm] }).catch(() => {
                return
            })
            await message.channel.send({ embeds: [chan] })
        } else if (!data) {
            return message.reply({
                content: `The user is not muted according to the database`
            })
        }
    }
}
export default MuteCommand;

async function muterole(message: Message) {
    let mutedrole: any
    const custommuterole = await muterolschema.findOne({
        guildId: message.guild?.id
    })
    const uhhh = await message.guild?.roles.cache.find(r => {
        return r.name === 'Muted'
    })
    if (!uhhh) {
        mutedrole = null
    }
    if (custommuterole) {
        const mt = await message.guild?.roles.cache.find((r: Role) => {
            return r.id === custommuterole.muteRole
        })
        if (!mt) {
            await muterolschema.findOneAndRemove({
                guildId: message.guild?.id
            })
        }
        mutedrole = mt
    } else if (!custommuterole) mutedrole = uhhh
    return mutedrole
}