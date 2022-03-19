import {userType,codeLoginType,loginType} from '../static/types'
import axios from 'axios';
import {TEST_ENV,ENV_URL} from './backend'

const env=TEST_ENV

export const test=()=>{
  return axios.get(`${env}/user/test`)
}

export const sendmessage = (phone:string) => {
  return axios.get(`${env}/user/sendMessage`,{params:{phone:phone}});
};

export const register=(data:userType)=>{
  return axios.post(`${env}/user/register`,{...data});
}

export const login=(data:loginType)=>{
  return axios.get(`${env}/user/phonelogin`,{params:{...data}});
}

export const codeLogin=(data:codeLoginType)=>{
  return axios(`${env}/user/phoneLogin`,{data:data});
}