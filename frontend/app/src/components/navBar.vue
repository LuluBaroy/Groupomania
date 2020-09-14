<template>
  <div class="container-fluid row align-items-center p-2">
    <router-link :to="{name: 'wall'}" class="col-1 p-0" :style="{visibility: $route.name === 'profile' ? 'visible' : 'hidden'}"><i class="far fa-arrow-alt-circle-left d-flex flex-column"><span class="mt-2">Retour accueil</span></i></router-link>
    <div class="container">
      <img src="../assets/img/logo.png" class="col-10" alt="Logo Groupomania">
    </div>
    <i v-if="loggedIn" class="fas fa-power-off col-1 d-flex flex-column" @click.prevent="removeCookie"><span class="mt-2">Quitter</span></i>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  computed: {
    loggedIn () {
      return this.$store.state.user.loggedIn
    }
  },
  methods: {
    removeCookie () {
      this.$store.state.user.loggedIn = false
      this.$cookies.remove('user')
      this.$router.push({name: 'auth'})
    }
  }
}
</script>

<style scoped>
.container-fluid{
  background-color: #2C3F5F;
  margin: 0;
}
a{
  color: white;
  text-decoration: none;
}
a:hover{
  color: lightgray;
}
img{
  object-fit: scale-down;
  max-width: 30%;
}
i{
  font-size: 25px;
  color: white;
}
i:hover{
  color: grey;
}
</style>
