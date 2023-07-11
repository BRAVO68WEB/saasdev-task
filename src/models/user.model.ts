import mongoose, { Schema } from "mongoose";

export interface IUser {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): any;
}

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    source: {
        type: Schema.Types.ObjectId,
        ref: "Source",
    },
}, {
    timestamps: true
});

userSchema.methods = {
    view(full: boolean) {
        const view = {
            id: this._id,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            source: this.source,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        return full ? {
            ...view,
        } : view;
    }
};

export default mongoose.model<IUser>("User", userSchema);