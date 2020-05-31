<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p v-if="email">Your email address: {{ email }}</p>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

  export default {
    methods:{
        ...mapActions(['fetchUser'])
    },
   computed: {
    ...mapGetters([
        'user'
    ]),
    email() {
        return !this.user ? false : this.user.email
    }
  },
    created(){
      this.fetchUser();
    }
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>