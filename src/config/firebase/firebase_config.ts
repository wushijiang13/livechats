import firebase from  'firebase/firebase.js';

const firebaseConfig:object = {
    apiKey: "AIzaSyCH-AJ2WSFd9zvcaEX-ng4jrfiwl_NRh5s",
    authDomain: "livechat-7853e.firebaseapp.com",
    databaseURL: "https://livechat-7853e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "livechat-7853e",
    storageBucket: "livechat-7853e.appspot.com",
    messagingSenderId: "417952784035",
    appId: "1:417952784035:web:3af98fc740a7cbfc7ca916"
};

firebase.initializeApp(firebaseConfig);

const chatSubmit:Function = (nickName:String,chatContent:String,chatDate:String|Date) => {
    if (nickName.length == 0) {
        alert("昵称不能为空!");
        return ;
    }else if(chatContent.length == 0){
        alert("内容不能为空!");
        return ;
    }else{
        pushChatData(nickName,chatContent,chatDate)
    }
}

const pushChatData:Function =(nickName:String,chatContent:String, chatDate:String|Date) =>{
    chatsRef.push({
        chatContent,
        chatDate,
        nickName,
    });
}

let chatsRef:any = firebase.database().ref('chatList'); //连接实时数据库

export {chatsRef, chatSubmit}




