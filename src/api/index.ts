import {fetchHttp} from '../utils/http';

export const test = () => {
  return fetchHttp('user/test');
};
