import mongoose, { Schema } from "mongoose";

const sourceSchema = new Schema(
    {
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

sourceSchema.methods = {
    view(full: boolean) {
        const view = {
            id: this._id,
            name: this.name,
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

export default mongoose.model<ISource>("Source", sourceSchema);
