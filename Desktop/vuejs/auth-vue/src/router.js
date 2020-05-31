import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store/store';

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'

Vue.use(VueRouter);

const autoLogin = store.dispatch('tryAutoLogin');

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/signup', component: SignupPage },
  { path: '/signin', component: SigninPage },
  { 
    path: '/dashboard', 
    component: DashboardPage,
    beforeEnter: (to, from, next) => {
 
        if (store.state.auth.idToken) {
            next();
        } else {
            next('/signin');
        }

    }
 }
]

const router = new VueRouter({ 
    mode: 'history', 
    routes
});
 
router.beforeEach((to, from, next) => autoLogin.then(next));
 
export default router;

// export default new VueRouter({mode: 'history', routes})