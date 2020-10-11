<template>
  <header class="container-fluid flex-column flex-md-row justify-content-md-around align-items-center p-2 d-flex">
    <!--LINK RETURN-->
    <div class="d-flex col-md-3 justify-content-center m-auto">
      <router-link :to="{name: 'wall'}" class="d-none d-md-flex col-md-3 justify-content-center p-0" :style="{visibility: visibilityTest ? 'visible' : 'hidden'}">
        <i class="far fa-arrow-alt-circle-left d-flex flex-column align-items-center">
          <span class="mt-2">Retour</span>
        </i>
      </router-link>
    </div>
      <!--LOGO-->
    <router-link :to="{name: 'wall'}" class="col-md-6">
      <img src="../assets/img/logo.png" tabindex="0" class="p-0 img-fluid" alt="Logo Groupomania" id="navBarLogo">
    </router-link>
    <!--DISCONNECTION BUTTON-->
    <div class="col-md-3 justify-content-center m-auto">
      <div v-if="currentUser.infos.role !== undefined" :style="{display: this.$cookies.isKey('user') ? 'flex' : 'none'}">
        <div class="d-flex col-4 justify-content-center">
          <router-link :to="{name: 'admin'}" class="d-flex justify-content-center">
            <i v-if="currentUser.infos.role.includes('admin')" class="fas fa-users-cog d-flex flex-column" id="admin">
              <b-popover target="admin" triggers="hover" placement="bottom">
                Administration
              </b-popover>
            </i>
          </router-link>
        </div>
        <router-link :to="`/profile/${currentUser.id}`" class="d-flex col-4 justify-content-center">
          <i class="fas fa-user d-flex flex-column justify-content-center" id="profileIcon">
            <b-popover target="profileIcon" triggers="hover" placement="bottom">
              Profil
            </b-popover>
          </i>
        </router-link>
        <router-link :to="{name: 'auth'}" class="d-flex col-4 justify-content-center">
          <i class="fas fa-power-off p-0 d-flex flex-column justify-content-center" @click.prevent="removeCookie" id="signOff">
            <b-popover target="signOff" triggers="hover" placement="bottom">
              Quitter
            </b-popover>
          </i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'navBar',
  computed: {
    visibilityTest () {
      if (this.$route.name === 'profile') {
        return true
      } else if (this.$route.name === 'faq') {
        return true
      } else if (this.$route.name === 'admin') {
        return true
      } else {
        return false
      }
    },
    currentUser () {
      return this.$store.state.user.currentUser
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
#navBarLogo:focus{
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  transition: 250ms ease-in-out;
  outline: none;
}
a{
  color: white;
  text-decoration: none;
}
a:hover, a:focus{
  color: lightgray;
  text-decoration: none;
}
img{
  object-fit: scale-down;
  max-height: 60px;
}
i{
  font-size: 25px;
  color: white;
}
i:hover, i:focus{
  color: grey;
}
</style>
