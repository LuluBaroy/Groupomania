<template>
  <main id="wall" class="col-lg-9 m-auto">
    <div class="col-md-12 flex-column">
      <section class="d-none d-lg-flex flex-column col-lg-8 ml-auto mr-auto mt-5">

        <!--WELCOMING CAROUSEL-->
        <b-carousel
          id="carousel-1"
          :interval="9500"
          controls
          indicators
          style="text-shadow: 1px 1px 2px #333; box-shadow: 0 0 12px black; border: 4px solid black"
        >
          <b-carousel-slide img-src="http://localhost:3000/images/Slide0.gif" img-alt="Image Bienvenue"></b-carousel-slide>
          <b-carousel-slide img-src="http://localhost:3000/images/Slide1.gif" img-alt="Image fonctionnalités"></b-carousel-slide>
          <b-carousel-slide img-src="http://localhost:3000/images/Slide2.png" img-alt="Image infos entreprise"></b-carousel-slide>
        </b-carousel>
      </section>

      <!--SEARCH BAR-->
      <section id="searchBarBg" class="mt-5 mb-5 align-items-center justify-content-center">
        <b-form-group label="Votre recherche :" label-for="barSearch" class="d-flex flex-column">
          <div class="d-flex flex-column flex-md-row mr-auto ml-auto">
            <b-form-input placeholder="Rechercher un utilisateur" id="barSearch" v-model="userResearch" class="col-md-8 ml-auto"></b-form-input>
            <b-button v-b-modal.researchModal id="btnSearch" type="submit" @click.prevent="research()" class="col-md-2 mr-auto"><i class="fas fa-search"> Rechercher</i></b-button>
            <b-modal centered v-if="showModal" id="researchModal" title="Utilisateur(s) correspondant(s) à votre recherche :" ok-only ok-variant="info" @hidden="clearResearch()">
              <div v-if="userResult.length === 0">Aucun utilisateur ne correspond à votre recherche</div>
              <div v-else class="my-4 d-flex row align-items-center justify-content-md-between" v-for="user in userResult" :key="user.id" id="userResearch">
                <router-link :to="`/profile/${user.id}`"><img :src="user.url_profile_picture" class=" d-flex img-fluid imgResearch"/></router-link>
                <h4 class="d-flex text-break col-8">{{ user.username }}</h4>
              </div>
            </b-modal>
          </div>
        </b-form-group>
      </section>

      <!--USER PART - SEE COMPONENT 'wall_userPart.vue'-->
      <user-part></user-part>

      <!--DIVIDER-->
      <div class="divider col-12 mt-3 p-3 p-md-0 d-flex flex-column flex-md-row justify-content-md-center align-items-md-center">
          <img src="../assets/img/divider.png" alt="logo groupomania" class="d-none d-md-flex m-2 pr-2"/>
          <h2>Der&shy;nières actua&shy;lités</h2>
          <img src="../assets/img/divider.png" alt="logo groupomania" class="d-none d-md-flex m-2 pl-2"/>
      </div>

      <!--POST PART - SEE COMPONENT 'wall_postPart.vue'-->
      <posts-part></posts-part>

    </div>

    <!--END DIVIDER-->
    <div id="divider_end">
      <img src="../assets/img/divider_end.png" alt="divider" class="img-fluid"/>
      <p v-if="posts.length !== 0">Fin des posts</p>
    </div>
  </main>
</template>

<script>
import UserPart from '../components/wall_userPart'
import PostsPart from '../components/wall_postsPart'
export default {
  name: 'wall',
  components: {PostsPart, UserPart},
  data () {
    return {
      userResearch: '',
      posts: this.$store.state.posts.allPosts,
      userResult: '',
      showModal: false,
      firstConnexion: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    }
  },
  beforeCreate () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('user/getCurrentUser')
        .catch(error => {
          if(error.message.split('code ')[1].includes('404')){
            this.$router.push({name: 'auth'})
            .then(() => {
              this.$cookies.remove('user')
            })
          }
        })
    }
  },
  beforeMount() {
    this.$store.dispatch('posts/getAllPosts')
            .then(() => {
              if(this.$store.state.user.currentUser.infos.lastLogin === '0000-00-00 00:00:00'){
                this.showWelcomeAlert()
              }
              if(this.$store.state.user.currentUser.infos.role.includes('admin')){
                this.$store.dispatch('messageWaiting')
              }
            })
  },
  methods: {
    showWelcomeAlert () {
      this.$swal({
        title: '<h2 style="color: deepskyblue;">Bienvenue !</h2>',
        position: 'center',
        html: `<p style="color: #2C3F5F;">Vous venez de vous inscrire sur notre réseau social !<br>
        Pour vous aider à commencer à vous servir de ses fonctionnalités,<br>
        voici quelques conseils : <br><br>
        - Vous pouvez accéder à votre page profil en cliquant sur <i class="fas fa-user" style="color: white; background-color: #2C3F5F; padding: 2%;"></i><br><br>
        - Si vous rencontrez un problème, rendez-vous sur la page FAQ<br><br>
        - Si vous ne trouvez pas de réponse à votre problème sur la page FAQ, n'hésitez pas à nous contacter via la rubrique "Nous Contacter"<br><br>
        <strong style="color: lightcoral;">- N'oubliez pas de rester courtois et poli lors de vos publications ou commentaires faute de quoi ceux ci pourront être modifiés ou supprimés par l'administrateur</strong><br><br>
        - N'hésitez pas à signaler tout contenu déplacé ou désobligeant en cliquant sur <i class="far fa-flag" style="color: red;"></i><br><br>
        Bonne navigation !</p>`,
        showConfirmButton: true
      }).then(() => {
        let formData = new FormData
        formData.append('lastLogin', '')
        let payload = {
          userId: this.currentUser.id,
          formData: formData
        }
        this.$store.dispatch('user/updateUser', payload)
      })
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    clearResearch () {
      this.showModal = false
      this.userResearch = ''
      this.userResult = ''
    },
    research () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
      if (this.userResearch.length === 0) {
        this.showAlertError('Merci de renseigner un nom avant de cliquer sur le bouton de recherche', '1500')
      } else if (regex.test(this.userResearch)){
        this.showAlertError(`Merci de ne pas utiliser les caractères suivant : |/*+&#{([]})<>$£€%=^ `, '4000')
      } else {
          let data = {
          research: this.userResearch.toString()
        }
        this.showModal = true
        this.$store.dispatch('researchUser', data)
          .then(() => {
            this.userResult = this.$store.state.research.resultResearch
          }).catch(error => {
            if (error.message.split('code ')[1].includes('500')) {
              this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
            } else if (error.message.split('code ')[1].includes('400')) {
              this.showAlertError(`Merci de renseigner un nom avant de cliquer sur le bouton de recherche`, '4000')
            } else if (error.message.split('code ')[1].includes('422')) {
              this.showAlertError(`Merci de ne pas utiliser les caractères suivant : |/*+&#{([]})<>$£€%=^ `, '4000')
            }
          })
      }
    }
  }
}
</script>

<style scoped>
  #wall{
    box-shadow: 0 0 12px grey;
  }
  .modal{
    font-family: Chewy;
  }
  a{
    display: flex;
    flex: 0 0 20%;
    justify-content: center;
  }
  .imgResearch{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 6px black;
  }
  .fa-search{
    font-size: 15px;
  }
  #barSearch{
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  #btnSearch{
    background-color: #2C3F5F;
    color: white;
    box-shadow: 0 0 6px black;
  }
  #btnSearch:hover{
    background-color: #0762a3;
  }
  .container{
    box-shadow: 0 0 12px;
    background-color: #F7F7F7;
  }
  .divider{
    background-color: #2C3F5F;
    color: white;
    border-radius: 50px;
    box-shadow: 0 0 12px black;
  }
  .divider h2{
    margin-bottom: 0;
  }
  .divider img{
    max-width: 5%;
  }
  #divider_end{
    margin: 5%;
  }
  @media screen and (min-width: 768px){
    #searchBarBg{
      padding: 2%;
      border: 4px double #2C3F5F;
      border-radius: 50px 0;
      background-color: rgba(176, 230, 255, 0.5);
      box-shadow: 0 0 3px black;
    }
  }
</style>
