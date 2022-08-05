import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/authorized/Dashboard'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: function (to, from, next) {
      const authorized = Vue.prototype.$db.authorized()
      if (authorized) {
        if (from) {
          next(from)
        } else {
          next('/')
        }
      } else {
        next(true)
      }
    }
  },
  {
    path: '/',
    component: Home,
    beforeEnter: function (to, from, next) {
      const authorized = Vue.prototype.$db.authorized()
      if (authorized) {
        next(true)
      } else {
        next('/login')
      }
    },
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: '/cloud/node',
        component: () => import('../views/authorized/cloud/node/Index')
      },
      {
        path: '/cloud/fwd',
        component: () => import('../views/authorized/cloud/fwd/Index')
      },
      {
        path: '/node',
        component: () => import('../views/authorized/node/Index')
      },
      {
        path: '/user/local',
        component: () => import('../views/authorized/user/local/Index')
      },
      {
        path: '/user/online',
        component: () => import('../views/authorized/user/online/Index')
      },
      {
        path: '/user/ldap',
        component: () => import('../views/authorized/user/ldap/Index')
      },
      {
        path: '/monitor/disk/partition',
        component: () => import('../views/authorized/monitor/disk/Index')
      },
      {
        path: '/monitor/network/interface',
        component: () => import('../views/authorized/monitor/network/Index')
      },
      {
        path: '/monitor/cpu/usage',
        component: () => import('../views/authorized/monitor/cpu/Index')
      },
      {
        path: '/monitor/mem/usage',
        component: () => import('../views/authorized/monitor/mem/Index')
      },
      {
        path: '/port/fwd/proxy',
        component: () => import('../views/authorized/proxy/Index')
      },
      {
        path: '/svc/custom',
        component: () => import('../views/authorized/service/custom/Index')
      },
      {
        path: '/svc/tomcat',
        component: () => import('../views/authorized/service/tomcat/Index')
      },
      {
        path: '/svc/other',
        component: () => import('../views/authorized/service/other/Index')
      },
      {
        path: '/svc/nginx',
        component: () => import('../views/authorized/service/nginx/Index')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
