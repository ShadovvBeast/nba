import mongoose from 'mongoose';
import { teamSchema } from "./team.js";

const { Schema } = mongoose;

export const playerSchema = new Schema({
    id: {type: Number, unique: true, index: true, required: true},
    first_name: String,
    last_name: String,
    position: String,
    height_feet: Number,
    height_inches: Number,
    weight_pounds: Number,
    team: teamSchema
});
