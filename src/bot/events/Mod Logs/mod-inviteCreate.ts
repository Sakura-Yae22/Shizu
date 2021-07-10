/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Invite } from 'discord.js';
import Event from '../../struct/Event';
import { modinvcre } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModInviteCreateEvent extends Event {
    constructor() {
        super({
            name: 'inviteCreate',
        });
    }

    public async exec(invite: Invite) {
        if (!invite.guild) return;
        const hook = await log(invite.guild, this.client);
        if (!hook) return;
        await modinvcre(invite, hook);
    }
}

export default ModInviteCreateEvent;
