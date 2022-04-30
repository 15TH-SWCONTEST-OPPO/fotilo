import {userType, codeLoginType, loginType} from '../static/types';
import axios from 'axios';
import {TEST_ENV, ENV_URL} from './backend';

const env = TEST_ENV;

/* 
  测试
*/

export const test = () => {
  return axios.get(`${env}/user/test`);
};

/* 
  登录注册
*/
// 短信验证
export const sendmessage = (phone: string) => {
  return axios.get(`${env}/user/sendMessage`, {params: {phone}});
};

// 注册
export const register = (data: userType) => {
  return axios.post(`${env}/user/register`, {...data});
};

// 登录
export const login = (data: loginType) => {
  return axios.post(`${env}/user/phonelogin`, {...data});
};

// 验证码登录
export const codeLogin = (data: codeLoginType) => {
  return axios.post(`${env}/user/phoneLogin`, {...data});
};

/* 
  用户
*/
// 获取用户
export const getUser = (
  isMe: boolean,
  userId?: string,
  type?: 'GETVIDEO' | 'GETNUM' | 'BOTH',
) => {
  return isMe
    ? axios.get(`${env}/user/getUserInfo`, {params: {userId, type}})
    : axios.get(`${env}/user/getOtherUserInfo`, {params: {userId, type}});
};

// 修改信息
export const changeInfo = (description: string) => {
  return axios.post(`${env}/user/edit`, {description});
};

// 登出
export const logout = () => {
  return axios.get(`${env}/user/logout`);
};

/* 
  视频
*/
// 获取视频列表
export const getVideoList = (recommendNum: number) => {
  return axios.get(`${env}/video/recommendList`, {params: {recommendNum}});
};

// 获取视频
export const getVideo = (videoId: string) => {
  return axios.get(`${env}/video/getVideoInfo`, {params: {videoId}});
};

// 上传视频
export const uploadVideo = (props: {
  title: string;
  coverURL?: string;
  fileName: string;
  tags?: string;
  description?: string;
}) => {
  return axios.post(`${env}/video/upload/auth`, {
    ...props,
    action: 'CreateUploadVideo',
  });
};

// 视频上传完毕
export const finishUploadV = (videoId: string) => {
  return axios.get(`${env}/video/upload/complete`, {params: {videoId}});
};

// 搜索视频
export const search = (searchKey: string, num: number) => {
  return axios.get(`${env}/video/search`, {params: {searchKey, num}});
};

// 获取评论
export const getComments = (videoId: number) => {
  return axios.get(`${env}/comment/list`, {params: {videoId, type: 'BYTIME'}});
};

// 评论
export const setComment = (videoId: number, content: string) => {
  return axios.post(`${env}/comment/create`, {videoId, content});
};

// 点赞
export const setLike = (videoId: number) => {
  return axios.get(`${env}/video/supports`, {params: {videoId}});
};

// 是否点赞
export const isLike=(videoId: number)=>{
  return axios.get(`${env}/video/isSupported`, {params: {videoId}});
}

/* 
  动态
*/
// 获取动态列表
export const getDynamicList = (recommendNum: number, userId?: string) => {
  return axios.get(`${env}/dynamic/recommendList`, {
    params: {recommendNum, userId},
  });
};

// 上传动态
export const setDynamic = (props: {
  content: string;
  videoId?: string;
  images?: Array<string>;
}) => {
  return axios.post(`${env}/dynamic/create`, {...props});
};

// 获取动态
export const getMyDynamic = (userId: string) => {
  return axios.get(`${env}/dynamic/getUserDynamic`, {params: {userId}});
};

/* 
  图片
*/
// 上传图片
export const uploadImg = (props: {
  title: string;
  imageType: 'DEFAULT' | 'COVER';
  imageExt: 'png' | 'jpg' | 'jpeg' | 'gif';
  tags?: Array<string>;
  description?: string;
}) => {
  const {tags} = props;
  let strTags: string = (tags && tags[0]) || '';
  tags &&
    tags.map(tag => {
      strTags = strTags + ',' + tag;
    });
  return axios.post(`${env}/image/upload/auth`, {
    ...props,
    tags: strTags,
    action: 'CreateUploadImage',
  });
};

// 图片上传完毕
export const finishUpload = (imageId: string) => {
  return axios.post(`${env}/image/upload/complete`, {imageId});
};

// 上传头像
export const uploadAvatar = (props: {userId: string; imageId: string}) => {
  return axios.post(`${env}/user/avatar/upload`, {...props});
};

/* 
  弹幕
*/
// 获取弹幕
export const getBS = (videoId: number) => {
  return axios.get(`${env}/bullet/get`, {params: {videoId}});
};

// 设置弹幕
export const setBS = (props: {
  videoId: number;
  content: string;
  duration: number;
  color: string;
}) => {
  return axios.post(`${env}/bullet/add`, {...props});
};
