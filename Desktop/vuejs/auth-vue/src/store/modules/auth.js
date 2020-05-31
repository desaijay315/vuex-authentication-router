import axios from '../../axios-auth';
import globalAxios from 'axios';
import router from '../../router';

const state = {
    userId: null,
    idToken: null,
    user: null
};

const getters = {
    user: state => state.user,
    isAuthenticated: state => (state.idToken !== null)
};

const actions = {
    async signup({commit, dispatch}, authData){
        await axios.post('/accounts:signUp?key=AIzaSyCLyL_pEf7ixW1qXAWqj9R7pX9Q11L3t8g', {
            email: authData.email, 
            password: authData.password,
            returnSecureToken: true
        })
          .then(res => {
              console.log(res);
              commit('AUTH_USER', {
                token: res.data.idToken,
                userId: res.data.localId
              });
              const now = new Date();
              const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
              localStorage.setItem('token', res.data.idToken);
              localStorage.setItem('userId', res.data.localId);
              localStorage.setItem('expirationDate', expirationDate)
              dispatch('storeUser', authData);
              dispatch('setLogoutTimer', res.data.expiresIn);
        })
          .catch(error => console.log(error))
    },

    async signin({commit,dispatch}, authData){
        await axios.post('/accounts:signInWithPassword?key=AIzaSyCLyL_pEf7ixW1qXAWqj9R7pX9Q11L3t8g', {
            email: authData.email, 
            password: authData.password,
            returnSecureToken: true
        })
          .then(res => {
              console.log(res);
              commit('AUTH_USER', {
                    token: res.data.idToken,
                    userId: res.data.localId
            });
            const now = new Date();
            const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('userId', res.data.localId);
            localStorage.setItem('expirationDate', expirationDate)
            dispatch('setLogoutTimer', res.data.expiresIn);
            router.replace('/dashboard');
        })
          .catch(error => console.log(error));
    },
    async storeUser(context,userData){
        console.log(userData);
        if(!state.idToken){
            return
        }
        globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log(error));

    },
    async fetchUser({commit}){
        if(!state.idToken){
            return
        }
        globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('CURRENT_USER', users[4]);
        })
        .catch(error => console.log(error))
    },
    logout({commit}){
        commit('LOGOUT');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
        router.replace('/signin');
    },
    setLogoutTimer({dispatch}, expirationTime){
        setTimeout(() =>{
            dispatch('logout');
        }, expirationTime * 1000)
    },
    tryAutoLogin({commit, dispatch}) {
        if (this.state.idToken) { // if someone is already logged in
          console.log('auto login not required; already logged in');
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) { // if there is no stored token found
          console.log('auto login not possible; no token stored');
          return;
        }
        const expirationDate = Date.parse(localStorage.getItem('expirationDate'))
        const now = new Date().getTime();
        if (now > expirationDate) { // if token is not valid anymore
          console.log('auto login not possible; token not valid anymore');
          return;
        }
        // we have a valid token stored, so we can auto logon
        const userId = localStorage.getItem('userId');
        dispatch('setLogoutTimer', (expirationDate - now) / 1000);
        commit('AUTH_USER', {
          token: token,
          userId: userId
        });
        console.log('auto login done');
      },
  
};

const mutations = {
   'AUTH_USER': (state, userData) => {
    state.userId  = userData.userId
    state.idToken = userData.token
   },
   'CURRENT_USER':(state, user) => (state.user = user),
   'LOGOUT':(state) => {
        state.userId  = null
        state.idToken = null
   }
};


export default {
    state,
    getters,
    actions,
    mutations
}