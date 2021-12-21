import '../css/index.css';//导入css 为了监听修改，后续会替换
import {chatsRef,emojiRef,chatSubmit,onValue} from './firebase.config' // 引入firebase 的配置
import Vue from 'vue/dist/vue'

new Vue({
    el:"#index",
    data:{
            state: {
                chatsList: [],
                emojiList: [],//emoji表情集
                prpoverVisible: false, // 气泡控制
                spinning: true, //加载控制
            },
            userState: {
                nickName: "", //昵称
                chatContent: "",
                nickCheckStatus: 0,//0 为未填写， 1 非法  2 合格 3 校验成功
            }
    },
    methods:{
      /***
       * 初始化
       * 获取本地存储nickname 如果没有就需要强行设置
       */
       init(){
            let nickName=localStorage.getItem('nickName');
            if (nickName == null) return ;
          if (this.checkNickName(nickName)) {
                this.userState.nickName = nickName;
                this.userState.nickCheckStatus = 3;
            }
       },
        /***
         * 验证昵称是否通过
         * @param nickName 昵称
         * @returns {string|*|void|undefined} 验证通过返回名字，没通过返回空字符串，用于直接判断。
         */
       checkNickName(nickName){
                let checkRule=new RegExp(/^[\u4e00-\u9fa5_a-zA-Z0-9-]{2,8}$/);
                let checkValue=nickName.replace(/\s/g, "");
                if (!checkValue.length) {
                    this.userState.nickCheckStatus=0;
                    return '';
                }else if (checkRule.test(checkValue)) {
                    this.userState.nickCheckStatus=2;
                    return checkValue;
                }else{
                    this.userState.nickCheckStatus=1;
                    //这里非法，是为了防止，有人直接通过浏览器 application 修改昵称用
                    //做的非法清空
                    window.localStorage.removeItem('nickName');
                    return '';
                }
       },
        /***
         * 清空输入框和去掉空格
         */
        clearChatContent(){
            this.userState.chatContent="";
            this.userState.chatContent=this.userState.chatContent.replace(/\s/g, "");
        },
        /**
         * 添加昵称
         */
        addNickName(){
            if (this.checkNickName(this.userState.nickName)) {
                localStorage.setItem('nickName',this.userState.nickName);
                this.init();
            }
        },
        /**
         * 转换年月日
         * @param date
         * @param fmt
         * @returns {*|void|string}
         */
        dateShow(date,fmt){
            let o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
            };
            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        },
        /**
         * 添加聊天
         * @param e
         */
        addChats(e){
            event.cancelBubble=true; //禁止换行
            event.preventDefault();
            event.stopPropagation();
            this.userState.chatContent = this.userState.chatContent.trim();
            chatSubmit(this.userState.nickName,this.userState.chatContent,this.dateShow(new Date(),"yyyy/MM/dd hh:mm:ss"));
            this.clearChatContent();
        },
        /**
         * emoji表情点击添加
         * @param item
         */
        emojiAddChat(item){
            this.userState.chatContent+=item;
            this.state.prpoverVisible=false;
        },
        /**
         * 变成底部
         * @returns {Promise<void>}
         */
        async scrollToEnd(){
            await this.$nextTick();
            this.$refs.chatMedia.scrollTop = this.$refs.chatMedia.scrollHeight;
        }
    },
    created(){
        onValue(chatsRef,(snapshot)=>{
            this.state.chatsList = snapshot.val();
            if(this.state.spinning) this.state.spinning=false;
            this.scrollToEnd();
        })
        onValue(emojiRef,(snapshot)=>{
            this.state.emojiList = snapshot.val();
        })
        this.init();
    }
})