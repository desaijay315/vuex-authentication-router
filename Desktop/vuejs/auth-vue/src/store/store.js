import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/auth';

//load Vuex
Vue.use(Vuex);

//create store
export default new Vuex.Store({
    modules:{
        auth
    }
})