export type userType={
    username: string;
    password?: string;
    phone?: string;
    code?: string;
    userID:string;
    avatar?:string;
    intr?: string;
    videoNum?:number;
    likeNum?:number;
    [key:string]:any
}

export type codeLoginType={
    phone: string;
    code:string
}

export type loginType={
    phone: string;
    password: string;
}