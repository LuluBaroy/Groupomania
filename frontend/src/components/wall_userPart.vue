<template>
  <div class="col-lg-12 row preWall" id="user">

    <!--USERNAME + PROFILE PICTURE-->
    <div class="userPart col-3 d-flex flex-column align-items-center">
      <h1>Bonjour<br> {{ currentUser.infos.username }} !</h1>
      <div>
        <!--LINK TO CURRENT USER PROFILE-->
        <router-link :to="`/profile/${currentUser.id}`" class="d-flex row align-items-center text-decoration-none"><img :src="currentUser.infos.url_profile_picture" :alt="currentUser.infos.alt_profile_picture" class="userPhoto">
          <!--IF USER IS ADMIN => NOTIFICATION FOR USER MESSAGE & REPORTS-->
          <i id="popover-content" v-if="currentUser.infos.role.includes('admin')" class="fas fa-envelope col-1" v-b-popover><span class="ml-1">{{ messageWaiting.total }}</span></i>
          <b-popover target="popover-content" triggers="hover" placement="bottomright"><template v-slot:title>Notification(s) :</template>Message(s): {{ messageWaiting.issues.length }} en attente <br>Signalement(s): {{ messageWaiting.postReports.length + messageWaiting.commentReports.length }} en attente</b-popover>
        </router-link>
      </div>
    </div>

    <!--FORM TO PUBLISH POST-->
    <b-form class="formPart" enctype="multipart/form-data" novalidate>
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
          <b-form-file v-model="file" class="mt-3" plain accept=".jpg, .png, .gif, .jpeg"></b-form-file>
          <b-button pill type="submit" id="submitPost" @click.prevent="publish()">Publier</b-button>
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
        title: null,
        content: null
      },
      file: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    },
    messageWaiting () {
      return this.$store.state.issues.messageWaiting
    }
  },
  methods: {
    showAlert (title, icon, timer) {
      this.$swal({
        title: title,
        position: 'top-end',
        icon: icon,
        showConfirmButton: false,
        timer: timer})
    },
    publish () {
      if (this.userPost.title === null || this.userPost.content === null || this.file === null) {
        this.showAlert('Merci de renseigner les différents champs', 'error', '1500')
      } else {
        let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
        if (!authorizedFile.includes(this.file.name.split('.')[1])) {
          this.showAlert(`Ce type de fichier n'est pas pris en charge`, 'error', '1500')
        } else {
          // eslint-disable-next-line no-useless-escape
          let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
          let newTitle = ''
          let newContent = ''
          if (regex.test(this.userPost.title)) {
            newTitle = this.userPost.title.replace(regex, ' ')
          }
          if (regex.test(this.userPost.content)) {
            newContent = this.userPost.content.replace(regex, ' ')
          }
          let formData = new FormData()
          if (newTitle.length !== 0) {
            formData.append('title', newTitle.toString())
          } else {
            formData.append('title', this.userPost.title.toString())
          }
          if (newContent.length !== 0) {
            formData.append('content', newContent.toString())
          } else {
            formData.append('content', this.userPost.content.toString())
          }
          formData.append('image', this.file)
          this.$store.dispatch('posts/createPost', formData)
            .then(() => {
              this.showAlert('Post publié !', 'success', '1500')
              this.$store.dispatch('posts/getAllPosts')
              this.userPost.title = ''
              this.userPost.content = ''
              this.file = null
            }).catch(error => {
              if (error.message.split('code ')[1].includes('400')) {
                this.showAlert(`Vous devez ajouter une image au format JPG, JPEG, PNG ou GIF !`, 'error', '2500')
              } else if (error.message.split('code ')[1].includes('500')) {
                this.showAlert(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, 'error', '3500')
              }
            })
        }
      }
    }
  },
  beforeMount () {
    this.$store.dispatch('messageWaiting')
      .then(response => {
        console.log(response.data)
      })
  }
}
</script>

<style>
  .swal2-popup, .modal{
    font-family: 'Chewy';
  }
  .swal2-title{
    color: #2C3F5F;
  }
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
  .fa-envelope{
    text-decoration: none;
    color: #2C3F5F;
  }
  .fa-envelope:hover{
    color: #0762a3;
  }
</style>
