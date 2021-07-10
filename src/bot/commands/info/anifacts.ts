/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Command from '../../struct/Command';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

abstract class AnimeFactsCommand extends Command {
    constructor() {
        super({
            name: 'anifacts',
            aliases: [],
            description: 'Anime Fatcts',
            usage: '<prefix>anifacts',
            category: 'info',
            cooldown: 10,
            ownerOnly: false,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }

    public async exec(message: Message, _args: string[]) {
        try {
            const row = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setLabel(`Report this here`)
                        .setStyle('LINK')
                        .setURL(`https://discord.gg/b7HzMtSYtX`)
                ]);
            const response = await fetch('https://animu.ml/fact?tags=&minLength=&maxLength=', {
                headers: { "Auth": this.client.secret.ANIMU, 'Content-Type': 'application/json' }
            }).then(response => response.json()).catch(err => err);

            if (response instanceof Error) {
                return message.reply({
                    content: `An Error occurred! Pls contact the devs`,
                    components: [row]
                })
            }
            if (response.statusCode) {
                return message.reply({
                    content: `**${message.author.tag}**, The service animu responded with ${response.statusCode}`
                })
            }
            const embed = new MessageEmbed()
            .setFooter(`Facts from Anime`)
            .setTitle(`A fact you didn\\'t know`)
            .setDescription(String(response.fact))
            .setThumbnail(`https://cdn.discordapp.com/attachments/836137183081529414/854292128850247680/tenor.png`)

            await message.channel.send({
                embeds: [embed]
            })
        } catch (e: any) {
            return this.client.logs(message, e, 'error');
        }
    }
}
export default AnimeFactsCommand;
