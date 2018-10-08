import Vue from 'vue'
import Router from 'vue-router'
import homeView from './views/home'
import errorView from './views/error'
import loginView from './views/login'
import registerView from './views/register'
import store from './store'
import i18n from './i18n'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeView
    },
    {
      path: '/signin',
      name: 'login',
      component: loginView
    },
    {
      path: '/signup',
      name: 'register',
      component: registerView
    },
    {
      path: '/file',
      name: 'file',
      component: () => import(/* webpackChunkName: "file" */ './views/file'),
      props: route => route.query
    },
    {
      path: '/file/upload',
      name: 'uploadFile',
      component: () =>
        import(/* webpackChunkName: "file" */ './views/fileUpload')
    },
    {
      path: '/file/new',
      name: 'newFile',
      component: () => import(/* webpackChunkName: "file" */ './views/fileNew')
    },
    {
      path: '/file/show/:id',
      name: 'showFile',
      component: () =>
        import(/* webpackChunkName: "file" */ './views/fileDetails'),
      props: route => ({ fileID: route.params.id })
    },
    {
      path: '/file/edit/:id',
      name: 'editFile',
      component: () =>
        import(/* webpackChunkName: "file" */ './views/fileEdit'),
      props: route => ({ fileID: route.params.id })
    },
    {
      path: '/problem',
      name: 'problem',
      component: () =>
        import(/* webpackChunkName: "problem" */ './views/problem'),
      props: route => route.query
    },
    {
      path: '/problem/show/:id',
      name: 'showProblem',
      component: () =>
        import(/* webpackChunkName: "problem" */ './views/problemDetails'),
      props: route => ({ id: route.params.id })
    },
    {
      path: '/problem/edit/:id',
      name: 'editProblem',
      component: () =>
        import(/* webpackChunkName: "problem" */ './views/problemEdit'),
      props: route => ({ id: route.params.id })
    },
    {
      path: '/problem/new',
      name: 'newProblem',
      component: () =>
        import(/* webpackChunkName: "problem" */ './views/problemEdit')
    },
    {
      path: '/solution',
      name: 'solution',
      component: () =>
        import(/* webpackChunkName: "solution" */ './views/solution'),
      props: route => route.query
    },
    {
      path: '/solution/show/:id',
      name: 'showSolution',
      component: () =>
        import(/* webpackChunkName: "solution" */ './views/solutionDetails'),
      props: route => ({ id: route.params.id })
    },
    {
      path: '/solution/new',
      name: 'newSolution',
      component: () =>
        import(/* webpackChunkName: "solution" */ './views/solutionNew'),
      props: route => ({
        problemID: route.query.id,
        viewType: route.query.type
      })
    },
    {
      path: '/role',
      name: 'role',
      component: () => import(/* webpackChunkName: "admin" */ './views/role'),
      props: route => route.query
    },
    {
      path: '/role/show/:id',
      name: 'showRole',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/roleDetails'),
      props: route => ({ roleID: route.params.id })
    },
    {
      path: '/role/edit/:id',
      name: 'editRole',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/roleEdit'),
      props: route => ({ roleID: route.params.id })
    },
    {
      path: '/role/new',
      name: 'newRole',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/roleEdit')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "admin" */ './views/user'),
      props: route => route.query
    },
    {
      path: '/user/show/:id',
      name: 'showUser',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/userDetails'),
      props: route => ({ userID: route.params.id })
    },
    {
      path: '/user/edit/:id',
      name: 'editUser',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/userEdit'),
      props: route => ({ userID: route.params.id })
    },
    {
      path: '/user/new',
      name: 'newUser',
      component: () =>
        import(/* webpackChunkName: "admin" */ './views/userEdit')
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter (to, from, next) {
        store.commit('resetAccessToken')
        next('/')
      }
    },
    {
      path: '*',
      name: 'notFound',
      component: errorView
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('updateTitle', i18n.t('online_judge'))
  next()
})

export default router
