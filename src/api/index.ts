import {userType, codeLoginType, loginType} from '../static/types';
import axios from 'axios';
import {TEST_ENV, ENV_URL} from './backend';

const env = TEST_ENV;

export const test = () => {
  return axios.get(`${env}/user/test`);
};

export const sendmessage = (phone: string) => {
  return axios.get(`${env}/user/sendMessage`, {params: {phone}});
};

export const register = (data: userType) => {
  return axios.post(`${env}/user/register`, {...data});
};

export const login = (data: loginType) => {
  return axios.post(`${env}/user/phonelogin`, {...data});
};

export const codeLogin = (data: codeLoginType) => {
  return axios.post(`${env}/user/phoneLogin`, {...data});
};

export const getUser = (
  isMe: boolean,
  userId?: string,
  type?: 'GETVIDEO' | 'GETNUM' | 'BOTH',
) => {
  return isMe
    ? axios.get(`${env}/user/getUserInfo`, {params: {userId, type}})
    : axios.get(`${env}/user/getOtherUserInfo`, {params: {userId, type}});
};

export const changeInfo = (description: string) => {
  return axios.post(`${env}/user/edit`, {description});
};

export const logout = () => {
  return axios.get(`${env}/user/logout`);
};

export const getVideoList = (recommendNum: number) => {
  return axios.get(`${env}/video/recommendList`, {params: {recommendNum}});
};

export const getVideo = (videoId: string) => {
  return axios.get(`${env}/video/getVideoInfo`, {params: {videoId}});
};

export const getDynamicList = (recommendNum: number,userId?:string) => {
  return axios.get(`${env}/dynamic/recommendList`, {params: {recommendNum,userId}});
};

export const setDynamic = (props: {
  content: string;
  videoId?: string;
  images?: Array<string>;
}) => {
  return axios.post(`${env}/dynamic/create`, {...props});
};


export const uploadImg= (props:{
  title:string,
  imageType:'DEFAULT'|'COVER',
  imageExt:'png'|'jpg'|'jpeg'|'gif',
  tags?:Array<string>,
  description?:string,
})=>{
  const{tags}=props
  let strTags:string=(tags&&tags[0])||''
  tags&&tags.map(tag => {
    strTags=strTags+','+tag;
  })
  return axios.post(`${env}/image/upload/auth`,{...props,tags:strTags,action:'CreateUploadImage'})
   
} 
export const finishUpload= (
  imageId:string,
)=>{
  return axios.post(`${env}/image/upload/complete`,{imageId})
   
} 

export const uploadAvatar=(props:{userId:string,imageId:string})=>{
  return axios.post(`${env}/user/avatar/upload`,{...props})
}