import mongoose from 'mongoose';
const { Schema } = mongoose;

export const teamSchema = new Schema({
    id: {type: Number, unique: true, index: true, required: true},
    abbreviation: String,
    city: String,
    conference: String,
    division: String,
    full_name: String,
    name: String
});