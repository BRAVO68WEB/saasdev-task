import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
    {
        name: {
            type: String,
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        source: {
            type: Schema.Types.ObjectId,
            ref: "Source",
        },
    },
    {
        timestamps: true,
    },
);

groupSchema.methods = {
    view(full: boolean) {
        const view = {
            id: this._id,
            name: this.name,
            users: this.users,
            source: this.source,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        return full
            ? {
                  ...view,
              }
            : view;
    },
};

export default mongoose.model<IGroup>("Group", groupSchema);
