//封装游客的临时身份的模块
import { v4 as uuidv4 } from 'uuid';

//生成一个随机的字符串，生成以后不能改变 - 且游客身份持久存储（本地存储）
export const getUUID = () => {
    //先看看有没有
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    //如果没有就生成新的，并存储到本地存储
    if (!uuid_token) {
        uuid_token = uuidv4();
        localStorage.setItem('UUIDTOKEN', uuid_token);
    }
    //如果不写返回值，调用getUUID（）之后返回值是undefined
    return uuid_token;
}