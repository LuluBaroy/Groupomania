<template>
  <div id="wall" class="col-lg-9 m-auto">
    <div class="col-md-12 flex-column">
      <div class="d-none d-lg-flex flex-column col-lg-8 ml-auto mr-auto mt-5">

        <!--WELCOMING CAROUSEL-->
        <b-carousel
          id="carousel-1"
          :interval="9500"
          controls
          indicators
          style="text-shadow: 1px 1px 2px #333; box-shadow: 0 0 12px black; border: 4px solid black"
        >
          <b-carousel-slide img-src="http://localhost:3000/images/Slide0.gif"></b-carousel-slide>
          <b-carousel-slide img-src="http://localhost:3000/images/Slide1.gif"></b-carousel-slide>
          <b-carousel-slide img-src="http://localhost:3000/images/Slide2.png"></b-carousel-slide>
        </b-carousel>
      </div>

      <!--SEARCH BAR-->
      <div id="searchBarBg" class="mt-5 mb-5 d-flex flex-column ml-auto mr-auto flex-md-row align-items-center justify-content-center">
        <b-form-input placeholder="Rechercher un utilisateur" id="barSearch" v-model="userResearch" class="col-md-9 col-lg-8 mt-md-1 mb-md-1"></b-form-input>
        <b-button v-b-modal.researchModal id="btnSearch" type="submit" @click.prevent="research()" class="col-md-2"><i class="fas fa-search"></i></b-button>
          <b-modal centered v-if="showModal" id="researchModal" title="Utilisateur(s) correspondant(s) à votre recherche :" ok-only ok-variant="info" @hidden="clearResearch()">
            <div v-if="userResult.length === 0">Aucun utilisateur ne correspond à votre recherche</div>
            <div v-else class="my-4 d-flex row align-items-center justify-content-md-between" v-for="user in userResult" :key="user.id" id="userResearch">
              <router-link :to="`/profile/${user.id}`"><img :src="user.url_profile_picture" class=" d-flex img-fluid imgResearch"/></router-link>
              <h4 class="d-flex text-break col-8">{{ user.username }}</h4>
            </div>
          </b-modal>
      </div>

      <!--USER PART - SEE COMPONENT 'wall_userPart.vue'-->
      <user-part></user-part>

      <!--DIVIDER-->
      <div class="divider col-12 mt-3 d-flex flex-column flex-md-row justify-content-md-center align-items-md-center">
          <img src="../assets/img/divider.png" alt="logo groupomania" class="d-none d-md-flex m-2 pr-2"/>
          <h2>Dernières actualités</h2>
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
  </div>
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
      showModal: false
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
    }
  },
  beforeMount() {
    this.$store.dispatch('posts/getAllPosts')
            .then(() => {
              let today = new Date()
              let dd = String(today.getDate()).padStart(2, '0');
              let mm = String(today.getMonth() + 1).padStart(2, '0');
              let yyyy = today.getFullYear();
              let hour = String(today.getHours()).padStart(2, '0')
              let minutes = String(today.getMinutes()).padStart(2, '0')
              let time = hour + ':' + minutes
              today = yyyy + '-' + mm + '-' + dd;
              let createdAtDate = this.currentUser.infos.created_at.split(' ')[0]
              let createdAtTime = this.currentUser.infos.created_at.split(' ')[1].split(':')[0] + ':' + String(parseInt(this.currentUser.infos.created_at.split(' ')[1].split(':')[1] + 2))
              if(today === createdAtDate && time < createdAtTime) {
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
      if (this.userResearch.length === 0) {
        this.showAlertError('Merci de renseigner un nom avant de cliquer sur le bouton de recherche', '1500')
      } else {
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
        let newResearch = ''
        let data = {
          research: null
        }
        if (regex.test(this.userResearch)) {
          newResearch = this.userResearch.replace(regex, '')
        }
        if (newResearch.length !== 0) {
          data.research = newResearch.toString()
        } else {
          data.research = this.userResearch.toString()
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
