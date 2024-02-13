import { z } from "zod";

export const AccountRequestValidator = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    selectedYear: z.string().refine((value) => {
        const year = parseInt(value);
        return year >= 2017 && year <= 2023;
    }, { message: "Invalid year format or out of range" }),
});

export type AccountRequest = z.infer<typeof AccountRequestValidator>;
