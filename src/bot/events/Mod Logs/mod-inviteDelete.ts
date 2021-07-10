/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Invite } from 'discord.js';
import Event from '../../struct/Event';
import { modinvdel } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModInviteDeleteEvent extends Event {
    constructor() {
        super({
            name: 'inviteDelete',
        });
    }

    public async exec(invite: Invite) { 
        if (!invite.guild) return;       
            const hook = await log(invite.guild, this.client);
            if (!hook) return;
            await modinvdel(invite, hook);
        }
    }

export default ModInviteDeleteEvent;