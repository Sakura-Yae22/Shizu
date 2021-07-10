/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';

abstract class BullyCommand extends Command {
    constructor() {
        super({
            name: 'bully',
            aliases: [],
            description: 'Bully ur friend the discord way : ) [NSFW should be reported immediately and the command should be be disabled]',
            usage: '<prefix>bully [person]',
            category: 'Action',
            cooldown: 0,
            ownerOnly: false,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }
    public async exec(message: Message, args: string[]) {
        try {
            let target = message.mentions.members?.first() || args[0];
            if (!args[0]) target = '**air...**'
            const {
                data: {
                    url
                }
            } = await axios.get(`https://waifu.pics/api/sfw/bully`)
            const embed = new MessageEmbed().setImage(`${url}`).setDescription(`Aww!! ${message.author} bullied ${target}`).setColor(`#FFC0CB`)
            message.reply({ embeds: [embed] })        } catch (e) {
            return this.client.logs(message, e, "error")
        }
    }
}
export default BullyCommand;
