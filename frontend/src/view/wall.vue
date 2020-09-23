<template>
  <div class="container">
    <div class="col-lg-12 flex-column preWall">
      <div class="d-flex flex-column col-8 m-auto">

        <!--WELCOMING CAROUSEL-->
        <b-carousel
          id="carousel-1"
          :interval="15000"
          controls
          indicators
          img-width="1024"
          img-height="490"
          style="text-shadow: 1px 1px 2px #333; box-shadow: 0 0 12px black; border: 4px solid black"
        >
          <b-carousel-slide
            img-src="http://localhost:3000/images/Slide0.gif" style="height: 265px;"
          ></b-carousel-slide>
          <b-carousel-slide img-src="http://localhost:3000/images/Slide1.gif" style="height: 265px;">
          </b-carousel-slide>
        </b-carousel>
      </div>

      <!--SEARCH BAR-->
      <b-nav-form id="searchBar">
        <b-form-input placeholder="Rechercher un utilisateur" id="barSearch" v-model="userResearch"></b-form-input>
        <b-button v-b-modal.researchModal id="btnSearch" type="submit" @click.prevent="research()"><i class="fas fa-search"></i></b-button>
          <b-modal v-if="showModal" id="researchModal" title="Utilisateur(s) correspondant(s) à votre recherche :" ok-only ok-variant="info" @hidden="clearResearch()">
            <div v-if="userResult.length === 0">Aucun utilisateur ne correspond à votre recherche</div>
            <div v-else class="my-4 d-flex row align-items-center col-12 justify-content-between" v-for="user in userResult" :key="user.id" id="userResearch">
              <router-link :to="`/profile/${user.id}`"><img :src="user.url_profile_picture" class=" d-flex img-fluid imgResearch"/></router-link>
              <h4 class="d-flex username">{{ user.username }}</h4>
            </div>
          </b-modal>
      </b-nav-form>

      <!--USER PART - SEE COMPONENT 'wall_userPart.vue'-->
      <user-part></user-part>

      <!--DIVIDER-->
      <div class="divider col-12">
        <h2><img src="../assets/img/divider.png" alt="logo groupomania"/>Dernières actualités<img src="../assets/img/divider.png" alt="logo groupomania"/></h2>
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
  beforeMount () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('user/getCurrentUser')
        .then(() => {
          this.$store.dispatch('posts/getAllPosts')
        })
    }
  },
  methods: {
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
  .modal{
    font-family: Chewy;
  }
  .username{
    flex: 0 0 80%;
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
  #searchBar{
    border-top: 4px double #2C3F5F;
    border-bottom: 4px double #2C3F5F;
    margin: 4% auto;
    display: flex;
    flex: 0 0 100%;
    justify-content: center;
    align-items: baseline;
    background-color: #b8ced4;
    border-radius: 100px;
  }
  .fa-search{
    font-size: 15px;
  }
  #barSearch{
    margin: 1% 0;
    flex: 0 0 50%;
    box-shadow: 0 0 12px black;
    text-align: center;
    color: #2C3F5F;
  }
  #btnSearch{
    flex: 0 0 10%;
    background-color: #2C3F5F;
    color: white;
    box-shadow: 0 0 12px black;
  }
  #btnSearch:hover{
    background-color: #0762a3;
  }
  #carousel-1{
    margin: 5% auto 0 auto;
  }
  .container{
    box-shadow: 0 0 12px;
    background-color: #F7F7F7;
  }
  .preWall{
    margin: 0 auto 0 auto;
    align-items: center;
    justify-content: space-around;
  }
  .divider{
    background-color: #2C3F5F;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    color: white;
    border-radius: 50px;
    margin: 5% auto;
    box-shadow: 0 0 12px black;
  }
  .divider h2{
    margin-bottom: 0;
  }
  .divider img{
    max-width: 5%;
    margin: 4%;
  }
  #divider_end{
    margin: 5%;
  }
</style>
