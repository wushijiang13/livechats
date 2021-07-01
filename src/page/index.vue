<template>
    <div class="index">
        <div class="chat">
            <div class="chat-media">
                <h3 class="chat-title"> LiveChat 聊天室</h3>
                <div class="media"  v-for="item in state.chatsData">
                    <div class="media-body">
                        <p class="media-heading">{{ dateShow(new Date(item.chatDate),"yyyy-MM-dd hh:mm:ss") }} <span class="media-name">{{item.nickName}}</span></p>
                        <p class="media-content">{{item.chatContent}}</p>
                    </div>
                </div>
            </div>
            <div class="enter">
                <a-divider>输入区域来喽</a-divider>
                <!-- 这里是负责初次进来填写的正常来说不填昵称不让输入的 -->
                <!-- <div class="init-enter">
                    <a-input v-model:value="value" placeholder="请输入3-7位您的昵称" />
                    <a-button type="primary" @click="addChats()" >开始聊天！</a-button>
                </div>-->
                <div class="enter-main">
                    <input type="text" class="form-control nickname" v-model="state.nickName" placeholder="昵称"/>
                    <input type="text" class="form-control speak" v-model="state.chatContent" placeholder="想说的话"/>
                    <a-button type="primary" @click="addChats()" >提交</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ref,defineComponent,reactive} from 'vue';
    import { chatsRef, chatSubmit} from '../config/firebase/firebase_config'
    export default defineComponent ({
        name:"index",
        setup(){
            let state:any=reactive({
                chatsData:[],
                nickName:"", //昵称
                chatContent:"",
            });
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

            const addChats:Function = () =>{
                chatSubmit(state.nickName,state.chatContent,dateShow(new Date(),"yyyy-MM-dd hh:mm:ss"));
            }

            return{
                state,
                addChats,
                dateShow
            }
        },
        created(): void {
            chatsRef.on('value', (snapshot:any) => {
                this.state.chatsData = reactive(snapshot.val());
            });
        }
    })
</script>

<style scoped>
    .index{
        width: 750px;
        margin: 0px auto;
    }
    .chat-media{
        width: 100%;
        height: 400px;
        border-radius: 5px;
        overflow-y: scroll;
        padding: 0px 10px;
        position: relative;
    }
    .chat-title{
        text-align: center;
        position: sticky;
        top: 0px;
        width: 100%;
        line-height: 40px;
        background: #4abf8a;
        color: #fff;
    }
    .enter{
        margin-top: 20px;
    }
    .enter-main{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .nickname{
        width: 120px !important;
        margin-right: 10px !important;
    }
    .speak{
        margin-right: 10px !important;
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
        display: inline-block;
    }
</style>