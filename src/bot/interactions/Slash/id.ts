/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CommandInteraction } from 'discord.js';
import Interaction from '../../struct/Interaction';

abstract class IDInteraction extends Interaction {
	constructor() {
		super({
			name: 'id',
			description: 'Guide to get ids',
			options: [
				{
					type: 3,
					name: 'platform',
					description: 'Select The Platform',
					required: true,
					choices: [
						{
							name: 'DeskTop',
							value: 'pc'
						},
						{
							name: 'Mobile',
							value: 'mob'
						}
					]
				}
			]
		});
	}

	public async exec(interaction: CommandInteraction, args: any[]) {
		const arg = args[0];
		const val = arg.value;
		if (val === 'pc') {
			interaction.reply({
				content: `**How 2 ID**
				**Note:** These tips apply to Desktop or PC usage. For mobile use the how2idmobile
				Firstly you must enable Developer Mode, to do this head to your discord settings with the :gear: icon on the bottom left of your screen.
				Then head to "Appearance" settings. Enable "Developer Mode" at the bottom.
				You will now be able to copy IDs easily.
				• For User ID, right-click the username or user avatar.
				• For Server ID, right-click the Server name or icon.
				• For Role ID, right-click the user, right-click the role.
				• For Message ID, right-click the message or hover and select the ••• button.
				• For Channel ID, right-click the channel name in the channel list. You can also shift+click the Copy ID button on a message to get both channel and message ID.
				In the right-click menu for any of the fields you've selected, you'll see the Copy ID option. Click it!
				https://cdn.dyno.gg/tags/copyid.png
				https://cdn.dyno.gg/tags/developermode.png
				`,
				ephemeral: true
			});
		}
		else {
			interaction.reply({
				content: `
				To copy a User, Channel or Server ID on your mobile device follow these steps:
				Ensure that "Developer Mode" is enabled by following the steps in ?tag mobiledevmode.
				**User ID**
				**For iOS:**
				1. Press and hold on the user you would like to copy the ID of.
				2. Click on "User Settings", then hit "Profile" at the top right of the pop up menu.
				3. Once you are on the profile page, click on the 3 menu dots "•••" at the top right of the page.
				4. Then hit "Copy ID" to copy the user's ID.
				For Android: Press and hold on the user's name you'd like to copy the ID of, then select "Copy ID"
				**Channel ID**
				1. Press and hold on the channel you would like to copy the ID of, then select "Copy ID".
				**Server ID**
				1. Press the Server Name at the top of the channel selection menu, then select "Copy ID"
				2. Additionally, you can also go to Server Settings/Widgets and copy the Server ID this way.
				**IOS Example** :small_red_triangle_down:
				https://cdn.dyno.gg/tags/iosid.gif
				`, 
				ephemeral: true
			});
		}
	}
}


export default IDInteraction;
