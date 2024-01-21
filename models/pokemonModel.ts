import mongoose, { Schema, Document } from "mongoose";

export interface IPokemon extends Document {
    id: Number,
    name: String,
    height: String,
    base_experience: String,
    sprites: { front_default: String },
    weight: String,
}

const pokemons: Schema = new Schema({
    id: { type: Number },
    name: { type: String, required: true },
    height: { type: String, required: true },
    base_experience: { type: String, required: true },
    weight: { type: String, required: true },
    sprites: { type: Object, required: true }
});

export default mongoose.model<IPokemon>("pokemons", pokemons);