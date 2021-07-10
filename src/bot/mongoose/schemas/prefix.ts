import mongoose from 'mongoose';
import { Iprefix } from '../interfaces/schemaInterface'

const prefixSystem = new mongoose.Schema({
  gId: { type: String, required: true },
  prefix: { type: String, required: true },
});

const prefix = mongoose.model<Iprefix>('prefix', prefixSystem);

export { prefix };
