import {Location} from 'react-router-native';

export default function (url: Location | string, num: number) {
  return typeof url === 'string'
    ? url.split(/\//)[num]
    : url.pathname.split(/\//)[num];
}
