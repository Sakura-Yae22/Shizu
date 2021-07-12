/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction, GuildMember } from 'discord.js';
import Interaction from '../../struct/Interaction';
import momentTimezone from 'moment-timezone';
import { Schedule_Schema as scheduledSchema } from '../../mongoose/schemas/schedule';

abstract class ScheduleInteraction extends Interaction {
    constructor() {
        super({
            name: 'schedule',
            description: 'Schedule messages',
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "Channel to send the message",
                    required: true
                },
                {
                    type: 3,
                    name: "date",
                    description: "Date to send the message (eg: <YYYY/MM/DD>)",
                    required: true
                },
                {
                    type: 3,
                    name: "hour-min",
                    description: "Time to send the message (eg: <HH:MM>)",
                    required: true
                },
                {
                    type: 3,
                    name: "am-pm",
                    description: "when to send the message (eg:  <\\\"AM\\\" or \\\"PM\\\"> )",
                    required: true
                },
                {
                    type: 3,
                    name: "timezone",
                    description: "Timezone of the time u want to send the message (eg: <Timezone>)",
                    required: true
                },
                {
                    type: 3,
                    name: "message",
                    description: "Message you want to schedule",
                    required: true
                }
            ]
        });
    }

    public async exec(interaction: CommandInteraction, args: any[]) {
        if (!interaction.guild) return interaction.reply({
            content: `Make sure this is a guild`
        })
        //  const channel = interaction.channel as TextChannel
        const member = interaction.member as GuildMember
        if (!member.permissions.has('ADMINISTRATOR')) return interaction.reply({
            content: `You dont have permission to use this command`
        });
        // if (!channel?.permissionsFor(interaction.guild?.me!).has('ADMINISTRATOR')) return interaction.reply(`You dont have permission to use this command`);
        const {
            guild
        } = interaction;
        const targetChannel = await guild.channels.cache.get(args[0].value);
        if (!targetChannel) {
            return interaction.reply({
                content: `Please tag a channel to send your message in.`,
                ephemeral: true
            })
        }
        if (targetChannel.type !== 'GUILD_NEWS') {
            return interaction.reply({
                content: `This is not a valid channel, Make sure this is a news channel`,
                ephemeral: true
            })
        }
        args.shift()
        const [date, time, clockType, timeZone, content] = args;

        if (clockType.value !== 'AM' && clockType.value !== 'PM') {
            interaction.reply({
                content: `You must provide either "AM" or "PM", you provided "${clockType}"`,
                ephemeral: true
            })
            return
        }
        const validTimeZones = momentTimezone.tz.names()
        if (!validTimeZones.includes(timeZone.value)) {
            interaction.reply({
                content: 'Unknown timezone! Please use one of the following: <https://cdn.discordapp.com/attachments/820856889574293514/823487572281524254/message.txt>',
                ephemeral: true
            })
            return
        }
        const targetDate = momentTimezone.tz(
            `${date.value} ${time.value} ${clockType.value}`,
            'YYYY-MM-DD HH:mm A',
            timeZone.value
        )
        // if (content.value.length > 2000) {
        //     interaction.reply({
        //         content: `Message Content too large, Make sure it is below 2000`,
        //         ephemeral: true
        //     })
        // }
        await new scheduledSchema({
            date: targetDate.valueOf(),
            content: content.value,
            guildId: guild.id,
            channelId: targetChannel.id,
        }).save()

        await interaction.reply({
            content: `Data saved successfully`
        });
    }
}


export default ScheduleInteraction;
