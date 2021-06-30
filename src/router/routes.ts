import {RouteRecordRaw} from 'vue-router'

let routers:Array<RouteRecordRaw>=[
    {
        path:'/',
        name:'index',
        component:() => import('../page/index.vue'),
    },
]


export { routers };