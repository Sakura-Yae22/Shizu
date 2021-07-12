/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-case-declarations */
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Interaction from '../../struct/Interaction';

abstract class IdeInteraction extends Interaction {
	constructor() {
		super({
			name: 'ide',
			description: 'Perfect Ide',
			options: [
				{
					type: 3,
					name: 'platform',
					description: 'Select The Platform',
					required: true,
					choices: [
						{
							name: 'Code Editor',
							value: 'ce'
						},
						{
							name: 'Visual Studio Code',
							value: 'vsc'
						},
						{
							name: 'WebStorm/PHPStorm',
							value: 'web/phps'
						},
						{
							name: 'Visual Studio',
							value: 'vs'
						},
						{
							name: 'Atom',
							value: 'at'
						},
						{
							name: 'Sublime Text',
							value: 'st'
						}
					]
				}
			]
		});
	}

	public async exec(interaction: CommandInteraction, args: any[]) {
		const arg = args[0];
		const val = arg.value;
		// tslint:disable-next-line: switch-default
		switch (val) {
			case 'ce':
				const ceembed = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Code Editors')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846582156737773608/Best-Code-and-Text-Editors.png')
					.addField('Code Editors:', 'Code editors are text editors that usually include syntax' +
						' highlighting, simple project management, and other helpful code' +
						' editing tools.');
				interaction.reply({ embeds: [ceembed] });
				break;
			case 'vsc':
				const vscembed = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Visual Studio Code')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846583244559220766/ZWQ2YzRhNTItYzg4Ny00NjA0LWI0NzItZWI5Mzg5ZDc3NDIy_visualstudio_code-card.png')
					.addField('VS Code', 'VS Code is another editor based off of web technology, but' +
						' is better optimized and runs faster. This is built by microsoft' +
						' and has a large set of plugins as well. [Download](https://code.visualstudio.com/)');
				interaction.reply({ embeds: [vscembed] });
				break;
			case 'web/phps':
				const embed = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('WebStorm/PHPStorm')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846584497969168404/webstorm-icon.png')
					.addField('WebStorm/PHPStorm (or any other JetBrains Product)', 'These IDEs, as they have a full suite of tools for' +
						' development. Additionally they have a plugin system for anything' +
						' that they do not automatically include. [Webstorm Download](https://www.jetbrains.com/webstorm/), [PHPStorm Download](https://www.jetbrains.com/phpstorm/)');
				interaction.reply({ embeds: [embed] });
				break;
			case 'vs':
				const vs = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Visual Studio')
					.addField('Visual Studio', 'Visual studio is a full IDE made by microsoft. It works well' +
						' with .NET based languages, as they are made by the same people.' +
						' They also include a plugin system. [Download](https://visualstudio.microsoft.com/)')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846586499918594118/Z.png');
				interaction.reply({ embeds: [vs] });
				break;
			case 'at':
				const atim = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Atom')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846587366022184970/-tBq3dGkIYf7cmz5w08GYX0_6PbwR5m4LW6y-ld5O9A.png')
					.addField('Atom', 'Atom is a code editor based on web technology. It\'s made by' +
						' GitHub, and has a massive community, with plugins for everything. [Download](https://atom.io/)');
				interaction.reply({ embeds: [atim] });
				break;
			case 'st':
				const sublime = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Sublime Text')
					.setThumbnail('https://cdn.discordapp.com/attachments/831552576180322305/846588724040302662/sublime-text-icon.png')
					.addField('Sublime Text', 'Sublime text starts off as a nice small and fast editor.' +
						' It\'s the fastest text editor that I\'ve seen. There is also a' +
						' wide selection of plugins. [Download](https://www.sublimetext.com/)');
				interaction.reply({ embeds: [sublime] });
				break;
		}
	}
}

export default IdeInteraction;
