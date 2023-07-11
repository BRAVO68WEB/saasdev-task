import mongoose, { Schema } from "mongoose";

export interface IApp {
    id: string;
    name: string;
    source: string;
    authorizedUsers: string[];
    authorizedGroups: string[];
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): any;
}

const appSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    source: {
        type: Schema.Types.ObjectId,
        ref: "Source",
    },
    authorizedUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    authorizedGroups: [{
        type: Schema.Types.ObjectId,
        ref: "Group",
    }],
}, {
    timestamps: true
});

appSchema.methods = {
    view(full: boolean) {
        const view = {
            id: this._id,
            name: this.name,
            source: this.source,
            authorizedUsers: this.authorizedUsers,
            authorizedGroups: this.authorizedGroups,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        return full ? {
            ...view,
        } : view;
    }
};

export default mongoose.model<IApp>("App", appSchema);