<template>
  <div class="container" id="containerbg" v-if="currentUser.id == this.$route.params.id">
    <h1>Votre compte</h1>
    <section class="container-fluid d-flex row align-items-center col-12" id="userPart">
      <div class="d-flex row m-auto">
        <img :src="currentUser.infos.url_profile_picture" class="userPhoto">
        <i class="far fa-edit align-self-end"></i>
      </div>
      <div class="d-flex m-auto">
        <b-card
          title="Vos informations"
          class="mb-2">
          <b-card-text>
            <div>
              <div class="d-flex row"><p>Email : </p><p>{{ currentUser.infos.email }}</p></div>
              <div class="d-flex row"><p>Mot de passe (ici masqué) : </p><p>{{ currentUser.infos.password }}</p></div>
              <div class="d-flex row"><p>Nom d'utilisateur : </p><p>{{ currentUser.infos.username }}</p></div>
              <div class="d-flex row" v-if="currentUser.infos.bio !== ''"><p>Bio : </p><p>{{ currentUser.infos.bio }}</p></div>
            </div>
          </b-card-text>
          <i class="far fa-edit" v-b-modal.updateProfile><span>Editer les informations</span></i>
          <b-modal ok-title="Modifier" ok-variant="info" cancel-title="Annuler" cancel-variant="warning" id="updateProfile" title="Editer vos informations" @ok="updateUser">
            <div class="my-4">
              <b-form-group
                id="fieldset-1"
                label="Email : "
                label-for="input-1"
              >
                <b-form-input id="input-1" v-model="userInfo.email"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-2"
                label="Mot de passe : "
                label-for="input-2"
              >
                <b-form-input id="input-2" v-model="userInfo.password"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-3"
                label="Nom d'utilisateur : "
                label-for="input-3"
              >
                <b-form-input id="input-3" v-model="userInfo.username"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-4"
                label="Bio : "
                label-for="input-4"
              >
                <b-form-textarea id="input-4" rows="2" max-rows="4" placeholder="Partagez quelques informations à propos de vous..." v-model="userInfo.bio">{{ userInfo.bio }}</b-form-textarea>
              </b-form-group>
              <b-form-file
                v-model="file"
                label="Image du profil : "
                :state="Boolean(file)"
                placeholder="Choisissez une nouvelle image de profil ..."
                drop-placeholder="Déposez votre fichier ici..."
              ></b-form-file>
              <div class="mt-3">Fichier sélectionné : {{ file ? file.name : '' }}</div>
            </div>
          </b-modal>
        </b-card>
      </div>
    </section>
    <section class="d-flex flex-column align-items-center container">
      <h2>Vos publications</h2>
      <div class="d-flex container-fluid row align-items-center justify-content-md-between allPosts" v-for="(post, index) in userPost" :key="index">
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
                <p>Créé le {{ post.createdAt.split('T')[0] }}</p>
                <i class="far fa-comments"><span>{{ post.Comments.length }}</span></i>
                <i class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
              </div>
            </div>
          </b-card-text>
        </b-card>
        <div class="d-flex flex-column postTools">
          <i class="fas fa-trash-alt"><span>Supprimer le post</span></i>
          <i class="far fa-edit"><span>Modifier le post</span></i>
        </div>
      </div>
    </section>
    <section class="d-flex flex-column align-items-center container" id="accountParam">
      <h2>Paramètres du compte</h2>
      <div class="container-fluid d-flex m-auto justify-content-around">
        <b-btn variant="info" @click="downloadInfo()">Télécharger les informations du compte</b-btn>
        <b-btn v-b-modal.modalAccount variant="danger" >Supprimer le compte</b-btn>
        <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" id="modalAccount" title="Suppression du Post" @ok="deleteAccount">
          <div class="my-4">
            Êtes vous sûr(e) de vouloir supprimer ce post ?
          </div>
        </b-modal>
      </div>
      <div class="container-fluid d-flex flex-column m-auto justify-content-around">
        <h3>Consentement pour le traitement de vos données</h3>
        <div>
          <b-form-group label="Acceptez-vous que nous partagions vos informations avec nos partenaires commerciaux ?">
            <b-form-radio v-model="consents.shareable" name="sharable" value="true">Oui</b-form-radio>
            <b-form-radio v-model="consents.shareable" name="sharable" value="false">Non</b-form-radio>
          </b-form-group>
        </div>
        <div>
          <b-form-group label="Acceptez-vous d'être contacté par nos services (notifications, newsletter, ...) ?">
            <b-form-radio v-model="consents.contactable" name="contactable" value="true">Oui</b-form-radio>
            <b-form-radio v-model="consents.contactable" name="contactable" value="false">Non</b-form-radio>
          </b-form-group>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
}
export default {
  name: 'accountCurrentUser',
  data () {
    return {
      consents: {
        contactable: false,
        shareable: false
      },
      file: null,
      userInfo: {
        email: this.$store.state.user.currentUser.infos.email,
        password: this.$store.state.user.currentUser.infos.password,
        username: this.$store.state.user.currentUser.infos.username,
        bio: this.$store.state.user.currentUser.infos.bio
      }
    }
  },
  computed: {
    currentUser () {
      console.log(this.$store.state.user.currentUser.id)
      return this.$store.state.user.currentUser
    },
    userPost () {
      return this.$store.state.posts.allPostsFromUser
    }
  },
  methods: {
    updateUser () {
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('email', this.userInfo.email)
      formData.append('password', this.userInfo.password)
      formData.append('username', this.userInfo.username)
      formData.append('bio', this.userInfo.bio)
      let payload = {
        userId: this.$store.state.user.currentUser.id,
        formData: formData
      }
      this.$store.dispatch('user/updateUser', payload)
        .then(() => {
          this.$store.dispatch('user/getCurrentUser', this.$store.state.user.currentUser.id)
            .then(() => console.log(this.$store.state.user.currentUser))
        })
    },
    deleteAccount () {
      this.$store.dispatch('user/deleteUser', this.$store.state.user.currentUser.id)
        .then(() => {
          localStorage.removeItem('user')
          this.$router.push({name: 'auth'})
        })
    },
    downloadInfo () {
      this.$store.dispatch('user/getOneUser', this.$store.state.user.currentUser.id)
        .then((user) => {
          let posts = []
          let comments = []
          let likes = []
          if (user.data.Posts.length === 0) {
            posts.push(`Vous n'avez rien posté !`)
          } else {
            for (let i in user.data.Posts) {
              for (const [key, value] of Object.entries(user.data.Posts[i])) {
                posts.push(`${key} : ${value}`)
              }
            }
          }
          if (user.data.Comments.length === 0) {
            comments.push(`Vous n'avez rien commenté !`)
          } else {
            for (let j in user.data.Comments) {
              for (const [key, value] of Object.entries(user.data.Comments[j])) {
                comments.push(`${key} : ${value}`)
              }
            }
          }
          if (user.data.Likes.length === 0) {
            likes.push(`Vous n'avez rien liké !`)
          } else {
            for (let k in user.data.Likes) {
              for (const [key, value] of Object.entries(user.data.Likes[k])) {
                likes.push(`${key} : ${value}`)
              }
            }
          }
          const document = {
            content: [
              {
                text: 'All your information\n\n',
                style: 'header'
              },
              {
                text: 'User Info\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  `id : ${user.data.id}`,
                  `email : ${user.data.email}`,
                  `password : ${user.data.password}`,
                  `username : ${user.data.username}`,
                  `role : ${user.data.role}`,
                  `bio : ${user.data.bio}`,
                  `url_profile_picture : ${user.data.url_profile_picture}`,
                  `alt_profile_picture : ${user.data.alt_profile_picture}`,
                  `created at : ${user.data.createdAt}`,
                  `updated at : ${user.data.updatedAt}\n\n`
                ]
              },
              {
                text: 'Posts\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  posts
                ]
              },
              {
                text: '\n\nComments\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  comments
                ]
              },
              {
                text: '\n\nLikes\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  likes
                ]
              }
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true
              },
              subheader: {
                fontSize: 15,
                bold: true
              }
            }
          }
          pdfMake.createPdf(document).download()
        })
    }
  },
  beforeMount () {
    this.$store.dispatch('posts/getAllPostsFromOneUser', this.$store.state.user.currentUser.id)
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
