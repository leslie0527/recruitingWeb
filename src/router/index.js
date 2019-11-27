import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import positionDetail from '@/components/positionDetail'
import head from '@/components/head'
import myResume from '@/components/myResume'
import comInfo from '@/components/comInfo'
import jobPost from '@/components/jobPost'
import admin from '@/components/admin'
import adminLogin from '@/components/adminLogin'
import adminManagement from '@/components/adminManagement'
import jobManagement from '@/components/jobManagement'
import userResume from '@/components/userResume'
import roleManagement from '@/components/roleManagement'
import resResume from '@/components/resResume'

Vue.use(Router)
// console.log(sessionStorage.getItem("id"))
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path:'/adminLogin',
      name:'adminLogin',
      component:adminLogin
    },
    {
      path:'/admin',
      name:'admin',
      component:admin,
      children:[
        {
          path:'/adminManagement',
          component:adminManagement
        },
        {
          path:'/jobManagement',
          component:jobManagement
        },
        {
          path:'/roleManagement',
          component:roleManagement
        },
        {
          path:'/userResume',
          component:userResume
        }
      ]
    },
    {
      path:'/head',
      name:'head',
      component:head,
      children:[
        {
          path:'/index',
          component:index
        },
        {
          path:'/resResume',
          component:resResume
        },
        {
          path:'/positionDetail',
          component:positionDetail
        },
        {
          path:'/myResume',
          component:myResume
        },{
          path:'/comInfo',
          component:comInfo
        },{
          path:'/jobPost',
          component:jobPost
        }
      ]
    },
  ]
})
