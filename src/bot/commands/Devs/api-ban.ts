/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';


abstract class ApiBanCommand extends Command {
    constructor() {
        super({
            name: 'api-ban',
            aliases: [],
            description: 'Ban pople from the api',
            usage: '<prefix>api-ban',
            category: 'Devs',
            cooldown: 2,
            ownerOnly: true,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }

    public async exec(message: Message, args: Array<string>) {
        const response = await fetch(`https://aria-api.up.railway.app/admin/ban?ID=${args[0]}`, {
            headers: {
                "auth": process.env.MAIN ?? 'null'
            }
        }).catch(() => null)
        // const response = await fetch(`http://localhost:3333/admin/ban?ID=${args[0]}`, {
        //     headers: {
        //         "auth": process.env.MAIN ?? 'null'
        //     }
        // }).catch(() => null)
        if (!response) return message.channel.send({
            content: `The api responded with a response which is not valid`
        })
        const key = await response.json();
        console.log(key);
        const embed = new MessageEmbed()
            .setDescription(key.message)
            .setColor('RANDOM')
        return message.channel.send({
            embeds: [embed]
        })

    }
}
export default ApiBanCommand;

