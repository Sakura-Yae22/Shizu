/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

abstract class HelpCommand extends Command {
	constructor() {
		super({
			name: 'help',
			aliases: ['h', 'heellllppp'],
			description: 'Display a list of all my commands!',
			category: 'util'
		});
	}

	public exec(message: Message, args: string[]) {
		const command = this.client.commands.get(args[0]);
		const categories = this.removeDuplicates(this.client.commands.filter(c => !c.ownerOnly).map(c => c.category));

		if (command) {
			const embed = new MessageEmbed().setColor('RANDOM')
				.setTitle(`${this.client.user?.username}\\'s Help Menu`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }), 'https://discord.gg/b7HzMtSYtX')
				.setDescription(stripIndents(`
				**Name:** ${command.name}
				**Usage:** ${command.usage ? command.usage : 'None'}
				**Aliases:** ${command.aliases?.length ? command.aliases.join(', ') : 'None'}
				**Description:** ${command.description}
			  `));
			return message.channel.send({
				embeds: [embed]
			})

		}
		else {
			const embed = new MessageEmbed().setColor('RANDOM')
				.setTitle(`${this.client.user?.username}\\'s Help Menu`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }), 'https://discord.gg/b7HzMtSYtX');
			for (const category of categories) {
				// tslint:disable-next-line: new-parens
				const commandNames: Array<string> = [];
				const commands = this.client.commands.filter(c => c.category === category);
				for (const command of commands) {
					if (!commandNames.includes(command[1].name)) {
						commandNames.push(command[1].name);
					}
				}
				embed.addField(category ?? 'Any', commandNames.map(c => `\`${c}\``).join(', '));
			}
			message.channel.send({
				embeds: [embed]
			});
		}
	}

	public removeDuplicates(array: Array<string | undefined>) {
		return [...new Set(array)];
	}
}

export default HelpCommand;
