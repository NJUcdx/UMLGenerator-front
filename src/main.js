import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import gojs from 'gojs';
Vue.prototype.go = gojs
Vue.config.productionTip = false

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next()
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
