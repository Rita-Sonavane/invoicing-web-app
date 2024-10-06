export interface Client {
    id?: string;
    name: string;
    email: string;
    password: string;
    confirmpassword: string;
    createdAt?: Date;
    _id: string;
}
