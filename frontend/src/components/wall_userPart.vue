<template>
  <section class="row preWall align-items-center justify-content-center" id="user">

    <!--USERNAME + PROFILE PICTURE-->
    <div class="col-md-3 mt-3 mb-5 mt-md-1 mb-md-4 mr-auto ml-auto d-flex flex-column align-items-center">
      <h1>Bonjour<br> {{ currentUser.infos.username }} !</h1>
      <div>
        <!--LINK TO CURRENT USER PROFILE-->
        <router-link :to="`/profile/${currentUser.id}`" class="d-flex flex-column align-items-center text-decoration-none" aria-label="profil utilisateur">
          <img :src="currentUser.infos.url_profile_picture" :alt="currentUser.infos.alt_profile_picture" class="userPhoto">
          <!--IF USER IS ADMIN => NOTIFICATION FOR USER MESSAGE & REPORTS-->
        </router-link>
        <router-link :to="{name: 'admin'}" class="text-decoration-none" aria-label="page admin">
          <i id="messages" v-if="currentUser.infos.role && currentUser.infos.role.includes('admin')" class="fas fa-envelope mt-3 col-md-1 p-0" v-b-popover>
            <span class="ml-1">{{ messageWaiting.total }}</span>
          </i>
          <b-popover target="messages" triggers="hover" placement="bottom" v-if="currentUser.infos.role && currentUser.infos.role.includes('admin') && messageWaiting"><template v-slot:title>Notification(s) :</template>Message(s): {{ messageWaiting.issues.length }} en attente <br>Signalement(s): {{ messageWaiting.postReports.length + messageWaiting.commentReports.length }} en attente</b-popover>
        </router-link>
      </div>
    </div>

    <!--FORM TO PUBLISH POST-->
    <div class="formPart p-1 pt-md-4 pb-md-3 pr-md-5 pl-md-5 mb-md-4 d-flex flex-column m-auto col-md-8 col-lg-7">
      <h2 class="mb-3 mb-md-5">Voulez-vous partager quelque chose ?</h2>
      <b-form enctype="multipart/form-data" novalidate class="d-flex flex-column">
        <b-form-group
          label="Titre :"
          label-for="title"
          class="d-flex flex-md-row align-items-center text-left"
          label-cols-md="3">
          <b-form-input
            id="title"
            v-model="userPost.title"
            class="m-0"
            placeholder="Titre de votre publication ... "
            :state="stateTitle"
            @keyup="testInput('title')"
          ></b-form-input>
          <div v-if="textTitle.length !== 0" style="color: red;">{{textTitle}}</div>
          <b-form-invalid-feedback>
            Merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          label="Publication :"
          label-for="content"
          class="d-flex flex-md-row text-left"
          label-cols-md="3">
          <b-form-textarea
            id="content"
            v-model="userPost.content"
            placeholder="Contenu de votre publication ..."
            class="col-md-12 m-0 text-center"
            rows="3"
            :state="stateContent"
            max-rows="6"
            @keyup="testInput('content')"
          ></b-form-textarea>
          <div v-if="textContent.length !== 0" style="color: red;">{{textContent}}</div>
          <b-form-invalid-feedback>
            Merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
          </b-form-invalid-feedback>
          <b-button v-b-modal.emojis class="rounded-pill d-flex mr-auto ml-auto mt-3" variant="dark">😃 Ajouter des emoticones !</b-button>
        </b-form-group>
        <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojis" triggers="hover" placement="top">
          <div class="d-flex row m-2">
            <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
          </div>
        </b-modal>
        <b-form-group
        label="Votre GIF :"
        label-for="fileInput"
        class="d-flex flex-column flex-md-row text-left"
        label-cols-md="3"
        description="Fichiers acceptés : 'jpg', 'jpeg', 'gif', 'png'">
          <img v-if="url.length > 0" :src="url" alt="GIF choisi par l'utilisateur" class="img-fluid imgPosts d-flex mr-auto ml-auto mb-3"/>
          <b-form-file id="fileInput" v-model="file" accept=".jpg, .png, .gif, .jpeg" class="text-left mr-auto ml-auto" @change="onFileChanged"></b-form-file>
          <div v-if="textFile.length !== 0" style="color: red;">{{textFile}}</div>
        </b-form-group>
        <b-button pill type="submit" id="submitPost" @click.prevent="testForm(), publish()" class="mt-3 mb-3 mr-auto ml-auto">Publier</b-button>
      </b-form>
    </div>

  </section>
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
      file: null,
      emojis: this.$store.state.posts.emojis,
      textTitle: '',
      textContent: '',
      textFile: '',
      url: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    },
    messageWaiting () {
      return this.$store.state.issues.messageWaiting
    },
    //FORM VALIDATION
    stateTitle () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.userPost.title.length > 0 && !regex.test(this.userPost.title)){
        return true
      } else if (this.userPost.title.length > 0 && regex.test(this.userPost.title) || regex.test(this.userPost.title)){
        return false
      } else {
        return null
      }
    },
    stateContent () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.userPost.content.length > 0 && !regex.test(this.userPost.content)){
        return true
      } else if (this.userPost.content.length > 0 && regex.test(this.userPost.content) || regex.test(this.userPost.content)){
        return false
      } else {
        return null
      }
    }
  },
  methods: {
    onFileChanged (e) {
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      const file = e.target.files[0]
      if (!authorizedFile.includes(file.name.split('.')[1])) {
        this.url = 'http://localhost:3000/images/wrongExtension.png'
      } else {
        this.url = URL.createObjectURL(file)
      }
    },
    testInput (text) {
      if(text === 'title') {
        if (this.userPost.title.length > 0) {
          this.textTitle = ''
        }
      } else if (text === 'content') {
        if (this.userPost.content.length > 0) {
          this.textContent = ''
        }
      } else if(text === 'file') {
        if (this.file !== null) {
          this.textFile = ''
        }
      }
    },
    testForm () {
      this.userPost.title.length === 0 ? this.textTitle = '* Champ requis' : this.textTitle = ''
      this.userPost.content.length === 0 ? this.textContent = '* Champ requis' : this.textContent = ''
      this.file === null ? this.textFile = '* Champ requis' : this.textFile = ''
    },
    showAlert (title, icon, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: icon,
        showConfirmButton: false,
        timer: timer})
    },
    getEmoji (index) {
      let emojiCode = this.emojis[index]
      if(this.userPost.content === null) {
        this.userPost.content = emojiCode
      } else {
        this.userPost.content += emojiCode
      }
      this.$swal({
        title: '',
        timer: '500',
        text: '✔ Ajouté !️',
        showConfirmButton: false
      })
    },
    publish () {
      if (this.userPost.content.length === 0|| this.userPost.title.length === 0 || this.file === null) {
        this.showAlert('Merci de renseigner les différents champs', 'error', '1500')
      } else {
        let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
        if (!authorizedFile.includes(this.file.name.split('.')[1])) {
          this.showAlert(`Ce type de fichier n'est pas pris en charge`, 'error', '1500')
        } else {
          let formData = new FormData()
          formData.append('title', this.userPost.title.toString())
          formData.append('content', this.userPost.content.toString())
          formData.append('image', this.file)
          this.$store.dispatch('posts/createPost', formData)
            .then(() => {
              this.showAlert('Post publié !', 'success', '1500')
              this.$store.dispatch('posts/getAllPosts')
              this.userPost.title = ''
              this.userPost.content = ''
              this.file = null
              this.url = ''
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
  }
}
</script>

<style>
  .imgPosts{
    box-shadow: 0 0 10px #2C3F5F;
    border: 4px solid white;
    max-width: 350px;
    max-height: 350px;
    object-fit: cover;
  }
  #emojis p{
    font-size: 20px;
  }
  .custom-file-input:lang(en) ~ .custom-file-label::after {
    content: 'Rechercher' !important;
  }
  .swal2-popup, .modal{
    font-family: 'Chewy';
  }
  .swal2-title{
    color: #2C3F5F;
  }
  .swal2-shown{
    color: #2C3F5F;
  }
  #messages, #messages span{
    font-size: 25px;
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
  .fa-envelope{
    text-decoration: none;
    color: #2C3F5F;
  }
  .fa-envelope:hover{
    color: #0762a3;
  }
</style>
