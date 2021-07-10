/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';

abstract class MeguminCommand extends Command {
    constructor() {
        super({
            name: 'megumin',
            aliases: [],
            description: 'Megumin pics : ) [NSFW should be reported immediately and the command should be be disabled]',
            usage: '<prefix>megumin',
            category: 'Action',
            cooldown: 0,
            ownerOnly: false,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }
    public async exec(message: Message) {
        try {
            const {
                data: {
                    url
                }
            } = await axios.get(`https://waifu.pics/api/sfw/megumin`)
            const embed = new MessageEmbed().setImage(`${url}`).setColor(`#FFC0CB`)
            message.reply({ embeds: [embed] })        } catch (e) {
            return this.client.logs(message, e, "error")
        }
    }
}
export default MeguminCommand;
