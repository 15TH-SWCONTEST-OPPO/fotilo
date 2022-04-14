import {users} from './user'
import {userType} from '../static/types'
export default (id: string):userType=>{
    return users.filter((u)=>u.userID===id)[0]
}