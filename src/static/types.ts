export type userType={
    username: string;
    password: string;
    phone: string;
    code: string;
    [key:string]:any
}
export type codeLoginType={
    phone: string;
    code:string
}