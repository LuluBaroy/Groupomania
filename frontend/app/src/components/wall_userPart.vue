<template>
  <div class="col-lg-12 row preWall" id="user">
    <div class="userPart">
      <h1>Bonjour<br> {{ currentUser.infos.username }} !</h1>
      <router-link :to="`/profile/${currentUser.id}`"><img :src="currentUser.infos.url_profile_picture" alt="123" class="userPhoto">
      </router-link>
    </div>
    <b-form class="formPart" enctype="multipart/form-data">
      <h2 id="posth2">Voulez-vous partager quelque chose ?</h2>
      <b-row class="mb-2">
        <b-col sm="3" class="mb-2">
          <label for="title">Titre :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="title"
            label="Titre :"
            label-for="title"
            v-model="userPost.title"
            required
            class="postInput"
            placeholder="Titre de votre publication ... "
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col sm="3">
          <label for="content">Votre publication :</label>
        </b-col>
        <b-col sm="9">
          <b-form-textarea
            id="content"
            v-model="userPost.content"
            placeholder="Votre publication ..."
            class="postInput"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" class="d-flex" id="buttonPart">
          <b-form-file v-model="file" class="mt-3" plain></b-form-file>
          <b-button pill type="submit" id="submitPost" @click.prevent="publish">Publier</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'userPart',
  data () {
    return {
      userPost: {
        title: '',
        content: ''
      },
      file: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    }
  },
  methods: {
    publish () {
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('title', this.userPost.title)
      formData.append('content', this.userPost.content)
      this.$store.dispatch('posts/createPost', formData)
        .then(() => {
          this.$store.dispatch('posts/getAllPosts')
        })
    }
  }
}
</script>

<style>
  .userPart{
    margin: 2% 0;
    align-items: center;
    justify-content: space-around;
  }
  .userPhoto{
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
  #submitPost{
    background-color: #2C3F5F;
    color: white;
  }
  #submitPost:hover{
    background-color: grey;
  }
  #posth2{
    margin-bottom: 5%;
  }
  #buttonPart{
    align-items: baseline;
  }
</style>
