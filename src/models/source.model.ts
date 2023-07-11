import mongoose, { Schema } from "mongoose";

export interface ISource {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    view(full: boolean): any;
}

const sourceSchema = new Schema({
    name: {
        type: String,
    }
}, {
    timestamps: true
});

sourceSchema.methods = {
    view(full: boolean) {
        const view = {
            id: this._id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        return full ? {
            ...view,
        } : view;
    }
};

export default mongoose.model<ISource>("Source", sourceSchema);