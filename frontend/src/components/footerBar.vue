<template>
  <div class="container-fluid navbarbg">
    <!--MODAL - COMING SOON - REPLACE WITH LINK TO COMPANY WEBSITE-->
    <b-button v-b-modal.site class="col-3 btn"><img src="../assets/img/logoFooter.png" alt="Logo Groupomania"></b-button>
    <b-modal ok-only ok-variant="info" ok-title="Fermer" id="site" title="Bientôt disponible !">
      <img src="../assets/img/comingSoon.png" alt="Le site de l'entreprise bientôt disponible !" class="img-fluid">
    </b-modal>

    <!--MODAL - CONTACT US - FOR ANY USER ISSUE-->
    <b-button class="col-3 btn" @click="showModal()"><span>Nous contacter</span></b-button>
    <b-modal ref="contact" title="Nous contacter" ok-only ok-title="Fermer" ok-variant="info">
      <p class="text-center mb-3">Pour vos différentes questions vous pouvez vous rendre sur notre rubrique FAQ<br>
        Si vous n'avez pas trouvé votre réponse, cliquez sur le bouton ci-dessous</p>
      <b-button id="showForm" class="d-flex m-auto" v-b-toggle.collapse-1 pill>Je n'ai pas trouvé ma réponse</b-button>
      <b-collapse id="collapse-1" class="mt-4">
        <b-card>
          <div>
            <b-form-group
              id="lastName"
              label="Nom :"
              label-for="lastName"
              align="center"
            >
              <b-form-input id="lastName" placeholder="Entrez votre nom" v-model="lastName"></b-form-input>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="firstName"
              label="Prénom :"
              label-for="firstName"
              align="center"
            >
              <b-form-input placeholder="Entrez votre prénom" id="firstName" v-model="firstName"></b-form-input>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="email"
              label="Email :"
              label-for="email"
              align="center"
            >
              <b-form-input placeholder="Entrez votre email" id="email" v-model="email"></b-form-input>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              label="Vos questions :"
              label-for="issue"
              align="center">
              <b-form-textarea
                id="issue"
                v-model="issue"
                placeholder="Pourquoi souhaitez-vous nous contacter ?"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </div>
          <b-button variant="info" pill type="submit" @click="submitForm()" class="d-flex m-auto" id="submitIssue">Envoyer</b-button>
        </b-card>
      </b-collapse>
    </b-modal>

    <!--LINK TO FAQ-->
    <b-button class="col-3 btn"><router-link :to="{name: 'faq'}"><span>FAQ</span></router-link></b-button>
  </div>
</template>

<script>
export default {
  name: 'footerBar',
  data () {
    return {
      lastName: '',
      firstName: '',
      email: '',
      issue: ''
    }
  },
  methods: {
    submitForm () {
      let data = {
        lastName: this.lastName,
        firstName: this.firstName,
        email: this.email,
        issue: this.issue
      }
      this.$store.dispatch('createIssue', data)
        .then(() => {
          this.hideModal()
          this.showAlertSuccess('Votre demande a bien été envoyée !')
          this.lastName = ''
          this.firstName = ''
          this.email = ''
          this.issue = ''
          this.$store.dispatch('messageWaiting')
        })
        .catch(() => {
          this.showAlertError('Une erreur est survenue, merci de réessayer ultérieurement !', '4000')
        })
    },
    showModal () {
      this.$refs['contact'].show()
    },
    hideModal () {
      this.$refs['contact'].hide()
    },
    showAlertSuccess (title) {
      this.$swal({
        title: title,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '2500'})
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    }
  }
}
</script>

<style scoped>
  #submitIssue, #showForm{
    background-color: #2C3F5F;
    color: white;
  }
  #submitIssue:hover, #showForm:hover{
    background-color: grey;
  }
  .navbarbg{
    padding: 1%;
    overflow-x: hidden;
    background-image: url("../assets/img/bgfooter.png");
    background-size: cover;
  }
  a{
    text-decoration: none;
  }
  .btn{
    color: black;
    background-color: transparent;
    border: none;
  }
  .btn img{
    object-fit: scale-down;
    max-width: 45%;
    margin: 2%;
  }
  span{
    color: black;
    font-size: 25px;
    text-decoration: underline;
  }
  .btn:hover{
    background-color: rgba(44, 63, 95, 0.5);
  }
</style>
