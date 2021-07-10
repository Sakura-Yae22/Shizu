/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suggest as schema } from '../mongoose/schemas/suggest';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import Interaction from '../struct/Interaction';

const status = {
    WAITING: {
        text: 'Waiting for Community Feed back',
        color: 'ORANGE'
    },
    ACCEPTED: {
        text: 'Idea Accepted',
        color: 'GREEN'
    },
    DENIED: {
        text: 'Idea Denied',
        color: 'RED'
    }
}

abstract class SuggestInteraction extends Interaction {
    constructor() {
        super({
            name: 'suggest',
            description: 'Suggest things for a server',
            options: [
                {
                    type: 3,
                    name: "reason",
                    description: "Suggestion or accept or deny reason",
                    required: true
                },
                {
                    type: 3,
                    name: "priority",
                    description: "Give the Priority u want to give",
                    required: false
                },
                {
                    type: 3,
                    name: "accept",
                    description: "(Mods only) Accept Suggestions (Message Id)",
                    required: false
                },
                {
                    type: 3,
                    name: "deny",
                    description: "(Mods only) Deny suggestion (Message Id)",
                    required: false
                }
            ]
        });
    }

    public async exec(interaction: CommandInteraction, args: any[]) {
        if (!interaction.guild) return interaction.reply('Please use it in your guild');
        const reason = trim(String(args[0].value));
        const title = String(args[1] ? args[1].name === 'priority' ? args[1].value : null : null)
        const accep = args[1] ? args[1].name === 'accept' ? args[1].value : null : null
        const den = args[1] ? args[1].name === 'deny' ? args[1].value : null : null

        if (title === 'null' && !accep && !den) return interaction.reply({
            content: 'You didn\'t specify whether to deny/accept or u have to specify a priority'
        });
        const accept = String(accep)
        const deny = String(den);
        if (title !== 'null' && title.length >= 200) return interaction.reply({
            content: 'Too Big of a Priority, Make sure it is lower than 200',
            ephemeral: true
        })
        // if (reason.length > 2000) return interaction.reply({
        //     content: 'Too Big of a Suggestion, Make sure it is lower than 2000',
        //     ephemeral: true
        // })
        if (accept !== 'null' && accept.length > 18) return interaction.reply({
            content: 'Too Big of a Accept Message ID, Make sure it is lower than 18',
            ephemeral: true
        })
        if (deny !== 'null' && deny.length > 18) return interaction.reply({
            content: 'Too Big of a Deny Message ID, Make sure it is lower than 18',
            ephemeral: true
        })
        const data = await schema.findOne({
            guildId: interaction.guild.id
        })
        if (!data) return;
        else if (data) {
            const channel = interaction.guild.channels.cache.get(`${BigInt(data.channelId)}`) as TextChannel;
            if (channel) {
                if (!channel.permissionsFor(interaction.guild.me!).has('MANAGE_MESSAGES') || !channel.permissionsFor(interaction.guild.me!).has('ADD_REACTIONS') || !channel.permissionsFor(interaction.guild.me!).has('USE_EXTERNAL_EMOJIS')) return interaction.reply('I dont have correct permissions ``` MANAGE_MESSAGES || USE_EXTERNAL_EMOJIS || ADD_REACTIONS```')
                const stats = status.WAITING
                if (accept !== 'null') {
                    const member = interaction.member as GuildMember
                    if (!member.permissions.has('MANAGE_MESSAGES')) return interaction.reply(`Make sure u have the \`Manage Members\` Permissions`)
                    const newStatus = status.ACCEPTED;
                    const messageId = accept.toString();
                    let check = false
                    const tmsg = await channel.messages.fetch(`${BigInt(messageId)}`, {
                        force: true,
                        cache: false
                    }).catch(() => {
                        check = true
                        interaction.reply({
                            content: `No such message could be found`,
                            ephemeral: true
                        })
                    })
                    if (check) return
                    if (!tmsg) return interaction.reply({
                        content: `No such message found`,
                        ephemeral: true
                    })
                    if (tmsg.author.id !== `${this.client.user?.id}`) return interaction.reply({
                        content: `Sorry!! But The message is not owned by me`,
                        ephemeral: true
                    })
                    const oldEmbed = tmsg.embeds[0]

                    if (!oldEmbed) return interaction.reply({
                        content: `No embed found`,
                        ephemeral: true
                    })

                    if (oldEmbed.footer) {
                        if (oldEmbed.footer.text !== 'Want to suggest something? Just type in this channel') return interaction.reply({
                            content: `No suggestion embed found`,
                            ephemeral: true
                        })
                        const dm = interaction.guild.members.cache.get(oldEmbed.title as Snowflake)
                        const dmms = new MessageEmbed()
                            .setTitle(`Suggestion Update in ${interaction.guild.name}`)
                            .setColor(newStatus.color as ColorResolvable)
                            .addField('Status', `**${newStatus.text}**\n${reason ? `Reason: ${reason}` : 'None'}`)
                            .setDescription(oldEmbed.description as string)
                        const embed = new MessageEmbed()
                            .setAuthor(oldEmbed.author?.name as string, oldEmbed.author?.iconURL)
                            .setDescription(oldEmbed.description as string)
                            .setColor(newStatus.color as ColorResolvable)
                            .addField('Status', `**${newStatus.text}**\n${reason ? `Reason: ${reason}` : 'None'}`)
                            .setFooter(`Want to suggest something? Just type in this channel (This suggestion is ${newStatus.text})`)
                        await dm?.send({
                            embeds: [dmms]
                        }).catch(_err => {
                            return
                        })
                        await tmsg.edit({ embeds: [embed] })
                        await interaction.reply({
                            content: `Suggestion Accepted ${tmsg.id}\n[Click to Jump to Message](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${tmsg.id})`
                        })
                        await tmsg.reactions.removeAll()
                    }
                    if (!oldEmbed.footer) {
                        return interaction.reply({
                            content: `The message tagged is not a suggestion embed`,
                            ephemeral: true
                        })
                    }
                }
                else if (deny !== 'null') {
                    const member2 = interaction.member as GuildMember
                    if (!member2.permissions.has('MANAGE_MESSAGES')) return interaction.reply({
                        content: `Make sure u have the \`Manage Member\` Permission`
                    })
                    const newStatus = status.DENIED;
                    const messageId = deny.toString();
                    let check = false
                    const tmsg = await channel.messages.fetch(`${BigInt(messageId)}`, {
                        force: true,
                        cache: false
                    }).catch(() => {
                        check = true
                        interaction.reply({
                            content: `No such message could be found`,
                            ephemeral: true
                        })
                    })
                    if (check) return
                    if (!tmsg) return interaction.reply({
                        content: `No such message found`,
                        ephemeral: true
                    })
                    if (tmsg.author.id !== `${this.client.user?.id}`) return interaction.reply({
                        content: `Sorry!! But The message is not owned by me`,
                        ephemeral: true
                    })
                    const oldEmbed = tmsg.embeds[0]

                    if (!oldEmbed) return interaction.reply({
                        content: `No embed found`,
                        ephemeral: true
                    })

                    if (oldEmbed.footer) {
                        if (oldEmbed.footer.text !== 'Want to suggest something? Just type in this channel') return interaction.reply({
                            content: `No suggestion embed found`,
                            ephemeral: true
                        })
                        const dm = interaction.guild.members.cache.get(oldEmbed.title as Snowflake)
                        const dmms = new MessageEmbed()
                            .setTitle(`Suggestion Update in ${interaction.guild.name}`)
                            .setColor(newStatus.color as ColorResolvable)
                            .addField('Status', `**${newStatus.text}**\n${reason ? `Reason: ${reason}` : 'None'}`)
                            .setDescription(oldEmbed.description as string)
                        const embed = new MessageEmbed()
                            .setAuthor(oldEmbed.author?.name as string, oldEmbed.author?.iconURL)
                            .setDescription(oldEmbed.description as string)
                            .setColor(newStatus.color as ColorResolvable)
                            .addField('Status', `**${newStatus.text}**\n${reason ? `Reason: ${reason}` : 'None'}`)
                            .setFooter(`Want to suggest something? Just type in this channel (This suggestion is ${newStatus.text})`)
                        await dm?.send({
                            embeds: [dmms]
                        }).catch(_err => {
                            return
                        })
                        await tmsg.edit({ embeds: [embed] })
                        await interaction.reply({
                            content: `Suggestion denied ${tmsg.id}\n[Click to Jump to Message](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${tmsg.id})`
                        })
                        await tmsg.reactions.removeAll()
                    }
                    if (!oldEmbed.footer) {
                        return interaction.reply({
                            content: `The message tagged is not a suggestion embed`,
                            ephemeral: true
                        })
                    }
                }
                else if (title !== 'null') {
                    const embed = new MessageEmbed()
                        .setColor(stats.color as ColorResolvable)
                        .setTitle(interaction.user.id)
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({
                            dynamic: true
                        }))
                        .setDescription(reason)
                        .addFields({
                            name: 'Status',
                            value: stats.text
                        }, {
                            name: 'Priority',
                            value: title
                        })
                        .setFooter(`Want to suggest something? Just type in this channel`)
                        .setTimestamp()
                    await channel.send({ embeds: [embed] }).then(async message => {
                        message.react('<a:tick_yes:835437429288468521>').then(() => {
                            message.react('<:tick_no:835440115706888195>')
                        })
                        await interaction.reply({
                            content: 'Done I have Sent the message',
                            ephemeral: true
                        })
                    })
                }
            } else if (!channel) {
                schema.findOneAndRemove({
                    guildId: interaction.guild.id
                })
                await interaction.reply({
                    content: 'I couldn\'t find a channel which was registered',
                    ephemeral: false
                })
            }
        }
    }
}


export default SuggestInteraction;

function trim(str: string): string {
    return str.length > 2000 ? `${str.slice(0, 2000)}...` : str
}