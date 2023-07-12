import { array, object, string, TypeOf } from "zod";

const createAppInputSchema = {
    body: object({
        name: string({
            required_error: "name is required!",
        })
    }),
};

const modifyAppInputSchema = {
    body: object({
        app_id: string({
            required_error: "app_id is required!",
        }),
        users: array(string({
            required_error: "users is required!",
        })).optional().nullable(),
        groups: array(string({
            required_error: "groups is required!",
        })).optional().nullable(),
    }),
};

const deleteAppInputSchema = {
    body: object({
        app_id: string({
            required_error: "app_id is required!",
        })
    }),
};

export const createAppInput = object(createAppInputSchema);
export type CreateAppInput = TypeOf<typeof createAppInput>;

export const modifyAppInput = object(modifyAppInputSchema);
export type ModifyAppInput = TypeOf<typeof modifyAppInput>;

export const deleteAppInput = object(deleteAppInputSchema);
export type DeleteAppInput = TypeOf<typeof deleteAppInput>;