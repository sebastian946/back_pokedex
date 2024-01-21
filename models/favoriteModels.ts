import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
    idUser: String,
    namePokemon: String
}

const favorite: Schema = new Schema({
    idUser: { type: String, required:true },
    namePokemon: { type: String, required: true }
});

export default mongoose.model<IFavorite>("favorite", favorite);
