export type UserParams = {
    _id?: string;
    username: string;
    email: string;
    [key: string]: any
};

export default class User {
    _id?: string;
    username?: string;
    email?: string;
    password?: string

    constructor(params: UserParams) {
        Object.assign(this, params);
    }

    get id() {
        return this._id
    }
}