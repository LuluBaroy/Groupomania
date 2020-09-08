<template>
  <div class="container" id="containerbg" v-if="currentUser != this.$route.params.id">
    <h1>{{ infos.username }}</h1>
    <div class="container-fluid d-flex row align-items-center col-12" id="userPart">
      <img :src="infos.url_profile_picture" class="userPhoto">
    </div>
    <div class="d-flex flex-column align-items-center container">
      <h2>Ses publications</h2>
      <div class="d-flex container-fluid row align-items-center justify-content-md-between allPosts" v-for="(post, index) in posts" :key="index">
        <b-card
          :title="post.title"
          class="mb-2 postConfig">
          <b-card-text>
            <div class="row">
              <div class="d-flex flex-column m-auto">
                <p>{{ post.content }}</p>
                <img v-if="post.url_gif !== null" :src="post.url_gif"/>
              </div>
              <div class="d-flex flex-column">
                <i class="far fa-comments"><span>{{ post.Comments.length }}</span></i>
                <i class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
              </div>
            </div>
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountOtherUser',
  data () {
    return {
      infos: {},
      posts: {},
      currentUser: this.$store.state.user.currentUser.id
    }
  },
  beforeMount () {
    this.$store.dispatch('user/getOneUser', this.$route.params.id)
      .then(response => {
        this.infos = response.data
        this.$store.dispatch('posts/getAllPostsFromOneUser', this.infos.id)
          .then(posts => {
            this.posts = posts.data
          })
      })
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
