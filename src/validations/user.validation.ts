import { object, string, TypeOf } from "zod";

const createUserInputSchema = {
    body: object({
        email: string({
            required_error: "Email is required!",
        }).email("Email is not valid!"),
        firstname: string({
            required_error: "First name is required!",
        }),
        lastname: string({
            required_error: "Last name is required!",
        }),
        username: string({
            required_error: "Username is required!",
        }),
        source: string({
            required_error: "Source is required!",
        }),
    }),
};

export const createUserInput = object(createUserInputSchema);
export type CreateUserInput = TypeOf<typeof createUserInput>;
