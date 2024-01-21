import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    userName: String,
    name: String,
    lastname: String,
    email: [type: String, unique: true],
    password: String,
    comparePassword(password: string): Promise<boolean>
}

interface IUserModel extends Model<IUser> {
    comparePassword(password: string): Promise<boolean>;
}

const user: Schema = new Schema({
    userName: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});



user.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashsedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashsedPassword;
    next();
});

user.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const passwordUser = this.password;
    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword, passwordUser, (err, success)=>{
            if(err) return reject(err);
            return resolve(success);
        });
    });
};

export default mongoose.model<IUser, IUserModel>('user', user);