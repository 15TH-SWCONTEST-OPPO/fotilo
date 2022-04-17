export type userType={
    username: string;
    password?: string;
    phone: string;
    code?: string;
    userId?:string;
    avatar?:string;
    description?: string;
    videoNum?:number;
    supportedNum?:number;
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

export type videoType={
    userId:string;
    videoId:string;
    videoURL:string;
    coverURL:string;
    title:string;
    duration:number;
    description?: string;
    watch?:number;
    like?:number;
    share?:number;
    star?: number;
    comment?:number;
}

export type commentType={
    userId:string;
    commentId:string;
    detail:string;
    username:string;
    avatar?:string;
}
