import {users} from './user'
import {userType} from '../static/types'
export default (id: string):userType=>{
    return id?users.filter((u)=>u.userID===id)[0]:{username:'',userID:'',phone:""}
}