import { User } from "../entities";
import { redacted } from "../../constants";

export type KVD = {
    email?: string;
    name?: string;
};

type UserData = {
    username: string;
    kvd: KVD;
};

export const getOrCreateUserFromHeaderData = async ({
    username,
    kvd,
}: UserData): Promise<User> => {
    // Return user if found
    let user = await User.findOne({ where: { username } });

    // Update user data if not prefilled
    if (user) {
        if (user.email === redacted) {
            user.email = kvd.email || redacted;
        }
        if (user.name === redacted) {
            user.name = kvd.name || redacted;
        }
        return await user.save();
    }

    // No user found, create new user and set up name and email
    user = await User.create({
        username,
        email: kvd.email || redacted,
        name: kvd.name || redacted,
    }).save();
    return user;
};
