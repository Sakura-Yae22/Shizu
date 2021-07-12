/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Interaction from '../../struct/Interaction';
import fetch from 'node-fetch';

abstract class MiniGamesInteraction extends Interaction {
	constructor() {
		super({
			name: 'minigames',
			description: 'Mini games',
			options: [
				{
					type: 1,
					name: 'ytt',
					description: 'Youtube together',
					options: [
						{
							type: 7,
							name: 'channel',
							description: 'Select the channel for the activity',
							required: true
						}
					]
				},
				{
					type: 1,
					name: 'poker',
					description: 'Poker Night (18+)',
					options: [
						{
							type: 7,
							name: 'channel',
							description: 'Select The channel for the activity',
							required: true
						}
					]
				},
				{
					type: 1,
					name: 'betrayal',
					description: 'play betrayal in a vc',
					options: [
						{
							type: 7,
							name: 'channel',
							description: 'Select the channel for the activity',
							required: true
						}
					]
				},
				{
					type: 1,
					name: 'fishington',
					description: 'Play fishington.io in a vc',
					options: [
						{
							type: 7,
							name: 'channel',
							description: 'Select the channel for the activity',
							required: true
						}
					]
				}
			]
		});
	}

	public async exec(interaction: CommandInteraction, args: any) {
		const com = args[0].name
		const channel = args[0].options.first()
		switch (channel.channel?.type) {
			case 'voice':
				switch (com) {
					case 'ytt':
						fetch(`https://discord.com/api/v8/channels/${channel.channel?.id}/invites`, {
							method: 'POST',
							body: JSON.stringify({
								max_age: 86400,
								max_uses: 0,
								target_application_id: '755600276941176913',
								target_type: 2,
								temporary: false,
								validate: null
							}),
							headers: {
								'Authorization': `Bot ${this.client.token}`,
								'Content-Type': 'application/json'
							}
						}).then(response => response.json()).then((invite) => {
							if (!invite.code) return interaction.reply('Error Has Occured');
							const embed = new MessageEmbed()
								.setColor('RED')
								.setFooter('This Activity Is not controled by the bot nor is it developed by the bot devs')
								.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/844517841784274964/ba84ebd03ebf628b62779075483eec9f.png')
								.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }), `https://discord.com/invite/${invite.code}`)
								.setDescription(`[Click Me to join and Start the activity](https://discord.com/invite/${invite.code})`);
							interaction.reply({
								embeds: [embed]
							});
						});
						break;
					case 'poker':
						fetch(`https://discord.com/api/v8/channels/${channel.channel?.id}/invites`, {
							method: 'POST',
							body: JSON.stringify({
								max_age: 86400,
								max_uses: 0,
								target_application_id: '755827207812677713',
								target_type: 2,
								temporary: false,
								validate: null
							}),
							headers: {
								'Authorization': `Bot ${this.client.token}`,
								'Content-Type': 'application/json'
							}
						}).then(response => response.json()).then((invite) => {
							if (!invite.code) return interaction.reply('Error Has Occured');
							const embed = new MessageEmbed()
								.setColor('DARK_BUT_NOT_BLACK')
								.setFooter('This Activity Is not controled by the bot nor is it developed by the bot devs')
								.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/844515473759928340/Anime-Poker-696x348.png')
								.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }), `https://discord.com/invite/${invite.code}`)
								.setDescription(`[Click Me to join and Start the activity](https://discord.com/invite/${invite.code})`);
							interaction.reply({ embeds: [embed] });
						});
						break;
					case 'betrayal':
						fetch(`https://discord.com/api/v8/channels/${channel.channel?.id}/invites`, {
							method: 'POST',
							body: JSON.stringify({
								max_age: 86400,
								max_uses: 0,
								target_application_id: '773336526917861400',
								target_type: 2,
								temporary: false,
								validate: null
							}),
							headers: {
								'Authorization': `Bot ${this.client.token}`,
								'Content-Type': 'application/json'
							}
						}).then(response => response.json()).then((invite) => {
							if (!invite.code) return interaction.reply('Error Has Occured');
							const embed = new MessageEmbed()
								.setColor('YELLOW')
								.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/844576079174828102/anime_girl_PNG89.png')
								.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }), `https://discord.com/invite/${invite.code}`)
								.setFooter('This Activity Is not controled by the bot nor is it developed by the bot devs')
								.setDescription(`[Click Me to join and Start the activity](https://discord.com/invite/${invite.code})`);
							interaction.reply({ embeds: [embed] });
						});
						break;
					case 'fishington':
						fetch(`https://discord.com/api/v8/channels/${channel.channel?.id}/invites`, {
							method: 'POST',
							body: JSON.stringify({
								max_age: 86400,
								max_uses: 0,
								target_application_id: '814288819477020702',
								target_type: 2,
								temporary: false,
								validate: null
							}),
							headers: {
								'Authorization': `Bot ${this.client.token}`,
								'Content-Type': 'application/json'
							}
						}).then(response => response.json()).then((invite) => {
							if (!invite.code) return interaction.reply('Error Has Occured');
							const embed = new MessageEmbed()
								.setColor('BLUE')
								.setFooter('This Activity Is not controled by the bot nor is it developed by the bot devs')
								.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/844574466943221781/c9f39a0d318b0ef19d705b88deb75f8e--fishing-anime.png')
								.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }), `https://discord.com/invite/${invite.code}`)
								.setDescription(`[Click Me to join and Start the activity](https://discord.com/invite/${invite.code})`);
							interaction.reply({ embeds: [embed] });
						});
				}
				break;
			default:
				interaction.reply('The selected channel must be a voice channel');
		}
	}
}

export default MiniGamesInteraction;
