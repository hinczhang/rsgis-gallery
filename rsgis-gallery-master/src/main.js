import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';


Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.Secret_Key=function(str,pwd,type){
    var b = require('js-base64').Base64;; //需要加载一个Base64.js文件 可以上网自行下载
    if(type=='E'){   //加密
        if(str=='')return '';
        else
            return b.encode(str)
        
    }
    if(type=='D'){  //解密
        if(str=='')return '';
        else
            return b.decode(str)
    }
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
