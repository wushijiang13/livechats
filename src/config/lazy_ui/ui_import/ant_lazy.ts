import { Button, Input , Divider , Spin , Popover,Tooltip} from 'ant-design-vue';
import {app} from '../../vue/app'

// @vue-ignore
[Button,Input,Divider,Spin,Popover,Tooltip].forEach(component => {
    app.use(component);
})