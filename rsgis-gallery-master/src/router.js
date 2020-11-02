import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

var router= new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'home test',
      component: () => import('./views/Home2.vue')
    },
    {
      path:'/temp',
      name:'temp page',
      component:()=>import('./views/temp.vue'),
      meta:{
        requireAuth:true
      }
    },
    {
      path:'/modifytemp',
      name:'temp page',
      component:()=>import('./views/modifytmp.vue'),
      meta:{
        requireAuth:true
      }
    },
    {
      path:'/itemtemp',
      name:'temp page',
      component:()=>import('./views/itemtemp.vue'),
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/user',
      name: 'User HomePage',
     
      component: () => import('./views/UserHomePage.vue'),
     
    },
    {
      path: '/item',
      name: 'Item',
      component: () => import('./views/UserItem.vue'),
      meta:{
        keepAlive:true,
        requireAuth:true
      }
    },
    {
      path: '/hometemp',
      name: 'hometemp',
      component: () => import('./views/hometemp.vue')
    },
    {
      path: '/regtemp',
      name: 'regtemp',
      component: () => import('./views/registertemp.vue'),
    },
    {
      path: '/create',
      name: 'Create Item',
      component: () => import('./views/CreateNewItem.vue'),
      meta:{
        keepAlive:true,
        requireAuth:true
      }
    },
    {
      path: '/modify',
      name: 'Modify Information',
      component: () => import('./views/ModifyInfo.vue'),
      meta:{
        keepAlive:true,
        requireAuth:true
      }
    },
    {
      path: '/login',
      name: 'Login Page',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/admin',
      name: 'Admin Dashboard',
      component: () => import('./views/AdminDashboard.vue'),
      redirect: '/ad-main',
      children: [
        {
          path: '/ad-main',
          name: 'Admin Dashboard Main Page',
          component: () => import('./views/AdmMainPage.vue'),
          meta: { title: '系统首页'}
        },
      
        {
          path: '/ad-user',
          name: 'Admin Dashboard User Manager',
          component: () => import('./views/AdmUserPage.vue'),
          meta: { title: '用户管理' }
        },
       
        {
          path: '/ad-files',
          name: 'Admin Dashboard File Manager',
          component: () => import('./views/AdmFilesPage.vue'),
          meta: { title: '文件管理' }
        },
        {
          path: '/ad-check',
          name: 'Admin Score Evaluate Manager',
          component: () => import('./views/AdmCheckPage.vue'),
          meta: { title: '分数管理' }
        }
      ]
    },
  ]
})

// 配置路由权限
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('token')) { // 判断本地是否存在access_token
      next()
    } else {
      // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
      next('/login')
    }
  } else {
    next()
  }
})

export default router
