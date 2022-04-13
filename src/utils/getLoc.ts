import { Location } from "react-router-native";

export default function (url:Location,num:number){
    return url.pathname.split(/\//)[num];
}