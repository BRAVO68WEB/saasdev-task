import { array, object, string, TypeOf } from "zod";

const createGroupInputSchema = {
    body: object({
        name: string({
            required_error: "name is required!",
        }),
    }),
};

const modifyGroupInputSchema = {
    body: object({
        group_id: string({
            required_error: "group_id is required!",
        }),
        users: array(
            string({
                required_error: "users is required!",
            }),
        )
            .optional()
            .nullable(),
    }),
};

const deleteGroupInputSchema = {
    body: object({
        group_id: string({
            required_error: "group_id is required!",
        }),
    }),
};

export const createGroupInput = object(createGroupInputSchema);
export type CreateGroupInput = TypeOf<typeof createGroupInput>;

export const modifyGroupInput = object(modifyGroupInputSchema);
export type ModifyGroupInput = TypeOf<typeof modifyGroupInput>;

export const deleteGroupInput = object(deleteGroupInputSchema);
export type DeleteGroupInput = TypeOf<typeof deleteGroupInput>;
