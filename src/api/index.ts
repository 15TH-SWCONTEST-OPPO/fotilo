import {fetchHttp} from '../utils/http';
import {userType,codeLoginType,loginType} from '../static/types'


export const test=()=>{
  return fetchHttp('user/test')
}

export const sendmessage = (phone:string) => {
  return fetchHttp('user/sendmessage?phone='+phone);
};

export const register=(data:userType)=>{
  return fetchHttp('user/register',{data:data});
}

export const login=(data:loginType)=>{
  return fetchHttp('user/login',{data:data});
}

export const codeLogin=(data:codeLoginType)=>{
  return fetchHttp('user/phoneLogin',{data:data});
}