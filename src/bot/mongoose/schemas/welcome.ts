import mongoose from 'mongoose';
import { IWelcome } from '../interfaces/schemaInterface';

const WelcomeSchema = new mongoose.Schema({ // Make schema
		guildId: {
            type: String,
            required: true
        },
        dmchan: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: false
        },
        message: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
});

const welcome = mongoose.model<IWelcome>('welcome', WelcomeSchema);

export { welcome, IWelcome };

