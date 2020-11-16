import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store';
import * as types from './store/types'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/login',
      component: {
        render: h => h('router-view')
      },
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Login.vue')
    }, 
    {
      path: '/user',
      name: 'user',
      redirect: '/user/list',
      component: () => import('./views/User.vue'),
      meta: {
        auth: true,
        requireAuth: true
      },
      children: [{
        path: '/user/list',
        name: 'list',
        component: () => import('./components/UserList/UserList.vue')
      }, {
        path: '/user/news',
        name: 'news',
        component: () => import('./components/News/News.vue')
      }, {
        path: '/user/member',
        name: 'member',
        component: () => import('./components/Member/Member.vue')
      }, {
        path: '/user/culture',
        name: 'culture',
        component: () => import('./components/Culture/Culture.vue')
      }]
    }
  ]
})

// 写的这个顺序，要在上面吗？？？？？

// 页面刷新时，重新赋值token，这里可以再次发请求获得
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

router.beforeEach((to, from, next) => {
  // 这样就验证它及其子路由了，to.meta.requireAuth只这样不验证子路由
  if (to.matched.some(r => r.meta.requireAuth)) {
    // 这里还没在vuex里写token
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router