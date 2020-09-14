<template>
  <div>
    <account-current-user v-if="currentUser.id == this.$route.params.id"></account-current-user>
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
  .allPosts{
    flex: 0 0 100%;
  }
  .postConfig{
    flex: 0 0 80%;
    flex-grow: 1;
  }
  .postTools{
    flex: 0 0 15%;
    flex-grow: 1;
  }
  i{
    font-size: 20px;
  }
  #containerbg{
    box-shadow: 0 0 12px black;
    background-color: #F7F7F7;
  }
  .card-body{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
    flex: 0 0 70%;
  }
  #userPart{
    margin: 2% 0;
    flex: 0 0 20%;
  }
  .userPhoto{
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
</style>
