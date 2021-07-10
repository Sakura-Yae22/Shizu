/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import flip from '../../struct/flip-text/flip';


abstract class FlipCommand extends Command {
	constructor() {
		super({
			name: 'flip',
			aliases: [],
			description: 'Flip text',
			usage: '<prefix>flip <term>',
			category: 'misc',
			cooldown: 0,
			ownerOnly: false,
			guildOnly: true,
			requiredArgs: 1,
			userPermissions: [],
			clientPermissions: []
		});
	}

	public async exec(message: Message, args: string[]) {
		try {
			const flipped: string[] = [];

			args.forEach(async (args: string) => {
				await flipped.push(flip(args));
			});


			const embeds = new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('Flipped text').setDescription(flipped.join(' ')).setTimestamp();
			await message.reply({
				embeds: [embeds],
				allowedMentions: {
					repliedUser: false
				}
			});
		} catch (e) {
			if (!message.guild) {
				return message.channel.send({
					content: `${e.message}`
				});
			}
			else return this.client.logs(message, e, 'error');
		}
	}
}
export default FlipCommand;
