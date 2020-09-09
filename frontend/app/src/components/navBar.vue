<template>
  <div class="container-fluid row align-items-center">
    <div class="container">
      <img src="../assets/img/logo.png" alt="Logo Groupomania">
    </div>
    <i v-if="cookieTest" class="fas fa-power-off mr-3" @click.prevent="removeCookie"></i>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  computed: {
    cookieTest () {
      return this.$cookies.isKey('user')
    }
  },
  methods: {
    removeCookie () {
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
