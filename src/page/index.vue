<template>
    <div class="norem-index">
        <div class="chat">
            <h3 class="chat-title"> LiveChat 聊天室</h3>
            <a-spin :spinning="state.spinning">
                <div class="chat-media" ref="chatMedia">
                    <div class="media"  v-for="item in state.chatsData">
                        <div class="media-body">
                            <p class="media-heading">{{ dateShow(new Date(item.chatDate),"yyyy/MM/dd hh:mm:ss") }} <span class="media-name">{{item.nickName}}</span></p>
                            <p class="media-content">{{item.chatContent}}</p>
                        </div>
                    </div>
                </div>
                <div class="enter">
                <!--   这里是负责初次进来填写的正常来说不填昵称不让输入的-->
                <div class="init-enter"  v-if="userState.nickCheckStatus !== 3">
                    <a-input v-model:value="userState.nickName" @change="checkNickName(userState.nickName)" placeholder="初次见面，请设定您的昵称~">
                        <template #suffix>
                            <a-tooltip  title="请输入您的昵称 长度在2-8位">
                                <ExclamationCircleOutlined  v-show="userState.nickCheckStatus === 0"/>
                            </a-tooltip>
                            <CheckOutlined v-show="userState.nickCheckStatus === 2" style="color: #4abf8a"/>
                            <CloseOutlined v-show="userState.nickCheckStatus === 1" style="color: #cc0000" />
                        </template>
                    </a-input>
                    <a-button type="primary" :disabled="userState.nickCheckStatus !== 2" @click="addNickName">开始聊天！</a-button>
                </div>
                <div class="enter-main" v-if="userState.nickCheckStatus === 3">
                    <div class="menu">
                        <a-popover placement="topLeft" v-model:visible="state.prpoverVisible" trigger="click">
                            <template #content>
                                <div class="menu-tip">
                                     <span class="menu-emoji" @click="emojiAddChat(item)"  v-for="item in state.emojiList">
                                        {{item}}
                                    </span>
                                </div>
                            </template>
                            <SmileOutlined class="emoji"/>
                        </a-popover>
                    </div>
                    <a-textarea
                            v-model:value="userState.chatContent"
                            placeholder="喷上他两句 Enter"
                            :rows="4"
                            @input="value=value.replace('/\n','')"
                            @keydown.enter.stop="addChats"
                            :showCount="true"
                    />
                    <!--  <a-button type="primary" @click="addChats()">键盘侠参上</a-button>-->
                </div>
            </div>
           </a-spin>
        </div>
    </div>
</template>

<script lang="ts">
    import { SmileOutlined,CheckOutlined,CloseOutlined,ExclamationCircleOutlined } from '@ant-design/icons-vue';
    import {ref,defineComponent,reactive,nextTick} from 'vue';
    import { chatsRef, emojiRef , chatSubmit} from '../config/firebase/firebase_config'
    export default defineComponent ({
        name:"index",
        setup(){
            let state:any=reactive({
                chatsData:[],
                emojiList:[],//emoji表情集
                prpoverVisible:false, // 气泡控制
                spinning:true, //加载控制
            });
            let userState:any=reactive({
                nickName:"", //昵称
                chatContent:"",
                nickCheckStatus:0,//0 为未填写， 1 非法  2 合格 3 校验成功
            })


            const  chatMedia=ref(null);
            const clearChatContent:Function = () => {
                userState.chatContent="";
                userState.chatContent=userState.chatContent.replace(/\s/g, "");
            }
            const checkNickName:Function = (nickName:String) : String =>{
                let checkRule=new RegExp(/^[\u4e00-\u9fa5_a-zA-Z0-9-]{2,8}$/);
                console.log(nickName);
                let checkValue=nickName.replace(/\s/g, "");
                if (checkValue.length == 0) {
                    userState.nickCheckStatus=0;
                    return '';
                }else if (checkRule.test(checkValue)) {
                    userState.nickCheckStatus=2;
                    return checkValue;
                }else{
                    userState.nickCheckStatus=1;
                    window.localStorage.removeItem('nickName');
                    return '';
                }

            }
            const addNickName:Function = () =>{
                if (checkNickName(userState.nickName) !== "") {
                    localStorage.setItem('nickName',userState.nickName);
                    init();
                }
            }
            const dateShow:Function = (date:Date,fmt:String) => {
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
            }
            const addChats:Function = (e) =>{
                event.cancelBubble=true; //禁止换行
                event.preventDefault();
                event.stopPropagation();
                userState.chatContent = userState.chatContent.trim();
                chatSubmit(userState.nickName,userState.chatContent,dateShow(new Date(),"yyyy/MM/dd hh:mm:ss"));
                clearChatContent();
            }
            const emojiAddChat:Function = (item:String)=>{
                userState.chatContent+=item;
                state.prpoverVisible=false;
            }
            const scrollToEnd:Function = async  () =>{
                await nextTick();
                chatMedia.value.scrollTop = chatMedia.value.scrollHeight;
            }
            /***
             * 初始化
             * 获取本地存储nickname 如果没有就需要强行设置
             */
            const init:Function = () =>{
                let nickName=localStorage.getItem('nickName');
                if (nickName == null) return ;
                if (checkNickName(nickName) !== "") {
                    userState.nickName=nickName;
                    userState.nickCheckStatus = 3;
                }
            }

            return{
                state,
                userState,
                chatMedia,
                init,
                dateShow,
                addChats,
                emojiAddChat,
                scrollToEnd,
                checkNickName,
                addNickName,
            }
        },
        created(): void {
            chatsRef.on('value', (snapshot:any) => {
                this.state.chatsData = reactive(snapshot.val());
                if(this.state.spinning) this.state.spinning=false;
                this.scrollToEnd();
            });
            emojiRef.on('value', (snapshot:any) => {
                this.state.emojiList = reactive(snapshot.val());
            });
            this.init();
        },
        components:{
            SmileOutlined,
            CheckOutlined,
            CloseOutlined,
            ExclamationCircleOutlined
        }
    })
</script>

<style scoped>
    .norem-index{
        max-width: 750px;
        margin: 0px auto;
    }
    .chat{
        user-select: none;
    }
    .chat-media{
        width: 98%;
        height: 430px;
        border-radius: 5px;
        overflow-y: scroll;
        margin: 0px auto;
    }
    .chat-title{
        text-align: center;
        width: 100%;
        font-size: 20px;
        height: 50px;
        line-height: 50px;
        /*background: #4abf8a;*/
        color: #000;
    }
    .enter{
        width: 98%;
        height: 180px;
        margin: 0px auto;
        margin-top: 6px;
        overflow: auto;
    }
    .menu{
        height: 36px;
        width: 100%;
        background: #f3f3f3;
        display: flex;
        align-items: center;
    }
    .emoji{
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
    .menu-tip{
        width: 200px;
    }
    .menu-emoji{
        margin: 2px;
        cursor: pointer;
        font-size: 20px
    }
    .enter-main{
        font-size: 14px;
    }
    .media-body{
        margin: 10px;
    }
    .media-heading{
        color: #595959;
        font-size: 12px;
    }
    .media-name{
        display: inline-block;
        padding: 2px 5px;
        background: #f8f8f8;
        border-radius: 5px;
    }
    .media-content{
        font-size: 14px;
        color: #000000;
        font-weight: 600;
        margin-top: 5px;
    }

    .init-enter{
        display: flex;
        justify-content: center;
    }
</style>