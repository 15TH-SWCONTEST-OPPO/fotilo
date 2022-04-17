import {userType} from '../static/types';
export const users: Array<userType> = [
  {
    userId: '1',
    username: 'hyw',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F03%2F20200503193405_QavAd.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652526920&t=ba0d27b008409f3d4d55d4074ceac194',
    description: '四不四哦',
    phone: '1',
  },
  {
    userId: '2',
    username: 'hyw2',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F9f%2F6b%2Fc8%2F9f6bc8cf69fc651d6f2d2af3778dee17.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652527140&t=5f7d4e0cad73155e8eca75ce0003c3dc',
    description: '我给你头打掉',
    phone: '2',
  },
  {
    userId: '3',
    username: 'hyw3',
    avatar:
      'https://img2.baidu.com/it/u=1885243548,3700178285&fm=253&fmt=auto&app=120&f=JPEG?w=613&h=406',
    description: '我给你头打掉',
    phone: '3',
  },
  {
    userId: '4',
    username: 'hyw4',
    avatar:
      'https://pic.rmb.bdstatic.com/bjh/news/839b6b35426210e72d92a75a14bbd91d.jpeg@wm_2,t_55m+5a625Y+3L+i/meabtOacieeCueaEj+aAnQ==,fc_ffffff,ff_U2ltSGVp,sz_21,x_14,y_14',
    description: '我给你头打掉',
    phone: '4',
  },
];

export const emptyUser: userType = {
  userId: '',
  username: '',
  avatar: '',
  description: '',
  phone: '',
};
