import { object, string, TypeOf } from "zod";

const checkAccessInputSchema = {
    body: object({
        app_name: string({
            required_error: "app_name is required!",
        }),
        email: string({
            required_error: "email is required!",
        }),
    }),
};

export const checkAccessInput = object(checkAccessInputSchema);
export type CheckAccessInput = TypeOf<typeof checkAccessInput>;