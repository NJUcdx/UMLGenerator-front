import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes:[
        {
          path:'/',
          redirect:'/topologyOne'
        },
        {
            path:'/',
            name:'Home',
            component:()=>import('@views/Home.vue'),
            meta:{title:'Home'},
            children:[
                {
                    path:'/topologyOne',
                    component:()=>import('@views/topologyOne.vue'),
                    meta:{title:'ospf'},
                },
                {
                    path:'/topologyTwo',
                    component:()=>import('@views/topologyTwo.vue'),
                    meta:{title:'rip'},
                }
            ]
        }
    ]
})