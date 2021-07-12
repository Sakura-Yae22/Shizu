/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Interaction from '../../struct/Interaction';
import fetch from 'node-fetch';

abstract class ChatInteraction extends Interaction {
	constructor() {
		super({
			name: 'chat',
			description: 'Chat with the bot',
			cooldown: 2,
			options: [
				{
					type: 'STRING',
					name: 'text',
					description: 'Text to chat lmao',
					required: true
				}
			]
		});
	}

	public async exec(interaction: CommandInteraction, args: any[]) {
		const text: string[] = []
		args.forEach(arg => {
			text.push(arg.value)
		})
		fetch(`https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(text.join(' '))}&uid=${interaction.user.id}&key=${this.client.secret.MONKE}`)
			.then(response => response.json()).then(data => {
				const embed = new MessageEmbed().setDescription(`${data.response}`).setFooter('Monke dev api = https://api.monkedev.com =')
				interaction.reply({
					embeds: [embed]
				});
			}).catch(async (e) => {
				return interaction.reply({
					content: `${e.message}`
				});
			});
	}
}

export default ChatInteraction;
