<template>
  <div>
    <!--ACCOUNT CURRENT USER - SEE COMPONENT 'account_currentUser.vue'-->
    <account-current-user v-if="currentUser.id == this.$route.params.id"></account-current-user>

    <!--ACCOUNT OTHER USER - SEE COMPONENT 'account_otherUser.vue'-->
    <account-other-user v-else></account-other-user>
  </div>
</template>

<script>
import accountCurrentUser from '../components/account_currentUser'
import accountOtherUser from '../components/account_otherUser'
export default {
  name: 'profile',
  components: {accountCurrentUser, accountOtherUser},
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    }
  },
  beforeMount () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    }
  }
}
</script>

<style scoped>
  i{
    font-size: 20px;
  }
  #containerbg{
    box-shadow: 0 0 12px grey;
    background-color: #F7F7F7;
  }
  .card-body{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
    flex: 0 0 70%;
  }
</style>
