import {app}  from "./config/vue/app";
import {initRouter} from './router/router'
import {routers} from "./router/routes";
//引入所有按需引入的UI库,只需要调用一下即可,内部会完成全局声明
import './config/lazy_ui/lazy_ui';

// app.config.globalProperties.allText='测试全局';

app.use(initRouter(routers))
    .mount('#app');