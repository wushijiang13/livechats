import {initializeApp} from  'firebase/app';
import {getDatabase,ref,onValue,push} from 'firebase/database'

//配置信息
const firebaseConfig = {
    apiKey: "AIzaSyCL59rWYn4qI40MOa55PFud-6dn-KtkiYc",
    authDomain: "chatdemo-aa281.firebaseapp.com",
    databaseURL: "https://chatdemo-aa281-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatdemo-aa281",
    storageBucket: "chatdemo-aa281.appspot.com",
    messagingSenderId: "771306835282",
    appId: "1:771306835282:web:de5dda7d19acc99a3bfe8b"
};

//初始化连接
initializeApp(firebaseConfig);

const database=getDatabase();
const chatsRef = ref(database,'chatList'); //获取聊天信息的引入位置
const emojiRef = ref(database,'emojiList'); //获取emoji的引入位置

/***
 * 提交函数，用于判断符合规则的信息提交
 * @param nickName 昵称
 * @param chatContent 聊天信息
 * @param chatDate 发送日期
 */
const chatSubmit = (nickName,chatContent,chatDate) => {
    if (nickName.length == 0) {
        alert("昵称不能为空!");
        return ;
    }else if(chatContent.trim() == ""){
        alert("内容不能为空!");
        return ;
    }else if(chatContent.length > 200 ){
        alert("内容超过最大字数!");
        return ;
    } else{
        pushChatData(nickName,chatContent,chatDate)
    }
}
/***
 * 添加聊天信息到firebase库里
 * @param nickName 昵称
 * @param chatContent 聊天信息
 * @param chatDate 发送日期
 */
const pushChatData =(nickName,chatContent, chatDate) =>{
    push(chatsRef,{
        chatContent,
        chatDate,
        nickName,
    })
}

export {chatsRef ,emojiRef , chatSubmit ,onValue }
