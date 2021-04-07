import Login from '../view/Login'
import Home from '../view/Home'

export const loginRouter = {
  path:'/login',
  name:'login',
  meta:{
    title:'登录'
  },
  component:Login
}

export const mainRouter = {
  path:'/home',
  name:'home',
  meta:{
    title:'Home'
  },
  component:Home
}
export const routers = [
  loginRouter,
  mainRouter,
  // toolbarRouter,
  // catch all redirect
  {path: '*', redirect: '/home'}

]
