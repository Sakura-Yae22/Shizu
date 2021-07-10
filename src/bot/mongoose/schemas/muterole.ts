import mongoose from 'mongoose';
import { IMuteRole } from '../interfaces/schemaInterface';

const muteRoleSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    muteRole: {
        type: String,
        required: true
    }
})

const muteRole = mongoose.model<IMuteRole>('MuteRole', muteRoleSchema)

export { muteRole }