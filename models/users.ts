import {dbConfig} from "../data/dbConfig";
import {IUser} from "../routes/users";

export const get = async () => {
    return dbConfig("users").select("id", "username", "admin");
};

export const getBy = async (filter: any) => {
    return dbConfig("users").where(filter).orderBy("id");
};


export const getById = async (id: string | number) => {
    return dbConfig("users").where({id}).select("id", "username", "admin").first();
};

export const create = async (user: IUser) => {
    const [id] = await dbConfig("users").insert(user);
    return getById(id);
};

export const update = async (user: IUser) => {
    const id = user.id;
    const exists = await getById(id);
    if (exists) {
        return dbConfig("users").where({id}).update(user);
    }
};

export const remove = async (id: string | number) => {
    const exists = await getById(id);
    if (exists) {
        return dbConfig("users").where({id}).del();
    }
};
