<template>
    <div class="index">
        LiveChat 聊天室
        <div class="chat">
            <div class="media"  v-for="item in state.chatsData">
                <div class="media-body">
                    <h4 class="media-heading">{{ dateShow(new Date(item.chatDate),"yyyy-MM-dd hh:mm:ss") }} {{item.nickName}}</h4>
                    {{item.chatContent}}
                </div>
            </div>
        </div>
        <div class="enter-main">
            <input type="text" class="form-control nickname" v-model="state.nickName" placeholder="昵称"/>
            <input type="text" class="form-control speak" v-model="state.chatContent" placeholder="想说的话"/>
            <button type="button" @click="addChats()" class="btn btn-info">提交</button>
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
            let msg=ref('Hello Vue 3 + TypeScript + Vite');

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
                msg,
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
    .title{
        line-height: 50px;
        font-size: 24px;
    }
    .chat{
        border: 1px solid #000000;
        width: 100%;
        height: 400px;
        border-radius: 5px;
        overflow-y: scroll;
    }
    .enter-main{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    .nickname{
        width: 120px !important;
        margin-right: 10px !important;
    }
    .speak{
        margin-right: 10px !important;
    }
    .media{
        margin: 10px !important;
    }
</style>