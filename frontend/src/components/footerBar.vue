<template>
  <footer class="container-fluid p-2 footerBg flex-column flex-md-row">
    <!--MODAL - COMING SOON - REPLACE WITH LINK TO COMPANY WEBSITE-->
    <b-button class="col-md-3" v-b-modal.site><img src="../assets/img/logoFooter.png" alt="Logo Groupomania" class="m-2"></b-button>
    <b-modal centered ok-only ok-variant="info" ok-title="Fermer" id="site" title="Bientôt disponible !">
      <img src="../assets/img/comingSoon.png" alt="Le site de l'entreprise bientôt disponible !" class="img-fluid">
    </b-modal>

    <!--MODAL - CONTACT US - FOR ANY USER ISSUE-->
    <b-button class="col-md-3" @click="showModal()"><span>Nous contacter</span></b-button>
    <b-modal centered ref="contact" title="Nous contacter" ok-only ok-title="Fermer" ok-variant="info">
      <p class="text-center mb-3">Pour vos différentes questions vous pouvez vous rendre sur notre rubrique FAQ<br>
        Si vous n'avez pas trouvé votre réponse, cliquez sur le bouton ci-dessous</p>
      <b-button id="showForm" class="d-flex m-auto" v-b-toggle.collapse-1 pill>Je n'ai pas trouvé ma réponse</b-button>
      <b-collapse id="collapse-1" class="mt-4">
        <b-card>
          <div>
            <b-form-group
              id="lastNameG"
              label="Nom :"
              label-for="lastName"
              align="center"
            >
              <b-form-input id="lastName" placeholder="Entrez votre nom" v-model="lastName" :state="stateLastName" @keyup="testFormInput('lastName')"></b-form-input>
              <div v-if="textLastName.length !== 0" style="color: red;">{{textLastName}}</div>
              <b-form-invalid-feedback>
                Merci de renseigner un nom valide (espace, apostophe et tiret acceptés)
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="firstNameG"
              label="Prénom :"
              label-for="firstName"
              align="center"
            >
              <b-form-input placeholder="Entrez votre prénom" id="firstName" v-model="firstName" :state="stateFirstName" @keyup="testFormInput('firstName')"></b-form-input>
              <div v-if="textFirstName.length !== 0" style="color: red;">{{textFirstName}}</div>
              <b-form-invalid-feedback>
                Merci de renseigner un prénom valide (espace, apostophe et tiret acceptés)
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="emailG"
              label="Email :"
              label-for="email"
              align="center"
            >
              <b-form-input placeholder="Entrez votre email" id="email" v-model="email" :state="stateEmail" @keyup="testFormInput('email')"></b-form-input>
              <div v-if="textEmail.length !== 0" style="color: red;">{{textEmail}}</div>
              <b-form-invalid-feedback>
                Merci de renseigner un email valide
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              label="Vos questions :"
              label-for="issueG"
              align="center">
              <b-form-textarea
                id="issue"
                v-model="issue"
                placeholder="Pourquoi souhaitez-vous nous contacter ?"
                rows="3"
                max-rows="6"
                :state="stateIssue"
                @keyup="testFormInput('issue')"
              ></b-form-textarea>
              <div v-if="textIssue.length !== 0" style="color: red;">{{textIssue}}</div>
              <b-form-invalid-feedback>
                Merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <b-button variant="info" pill type="submit" @click.prevent="testForm(), submitForm()" class="d-flex m-auto" id="submitIssue">Envoyer</b-button>
        </b-card>
      </b-collapse>
    </b-modal>

    <!--LINK TO FAQ-->
    <b-button class="col-md-3"><router-link :to="{name: 'faq'}"><span>FAQ</span></router-link></b-button>
  </footer>
</template>

<script>
export default {
  name: 'footerBar',
  data () {
    return {
      lastName: '',
      firstName: '',
      email: '',
      issue: '',
      textEmail: '',
      textLastName: '',
      textFirstName: '',
      textIssue: '',
      validation: {
        lastName: '',
        firstName: '',
        email: '',
        issue: ''
      }
    }
  },
  computed: {
    stateLastName () {
      let regexNames = new RegExp(/[A-Za-z -']{1,25}/)
      // eslint-disable-next-line no-useless-escape
      let regexNoCode = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`0-9]/g)
      if(this.lastName.length > 0 && regexNames.test(this.lastName) && !regexNoCode.test(this.lastName)){
        return true
      } else if(this.lastName.length > 0 && !regexNames.test(this.lastName) || this.lastName.length > 0 && regexNoCode.test(this.lastName) || regexNoCode.test(this.lastName)){
        return false
      } else {
        return null
      }
    },
    stateFirstName () {
      let regexNames = new RegExp(/[A-Za-z -']{1,25}/)
      // eslint-disable-next-line no-useless-escape
      let regexNoCode = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`0-9]/g)
      if(this.firstName.length > 0 && regexNames.test(this.firstName) && !regexNoCode.test(this.firstName)){
        return true
      } else if(this.firstName.length > 0 && !regexNames.test(this.firstName) || this.firstName.length > 0 && regexNoCode.test(this.firstName) || regexNoCode.test(this.firstName)){
        return false
      } else {
        return null
      }
    },
    stateEmail () {
      // eslint-disable-next-line no-useless-escape
      let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      if(this.email.length > 0 && regexEmail.test(this.email)){
        return true
      } else if (this.email.length > 0 && !regexEmail.test(this.email)){
        return false
      } else {
        return null
      }
    },
    stateIssue () {
      // eslint-disable-next-line no-useless-escape
      let regexNoCode = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.issue.length > 0 && !regexNoCode.test(this.issue)){
        return true
      } else if (this.issue.length > 0 && regexNoCode.test(this.issue) || regexNoCode.test(this.issue)){
        return false
      } else {
        return null
      }
    }
  },
  methods: {
    testFormInput (text) {
      if(text === 'email') {
        if(this.textEmail.length > 0){
          this.textEmail = ''
        }
      } else if (text === 'firstName'){
          if(this.textFirstName.length > 0){
            this.textFirstName = ''
          }
      } else if (text === 'lastName') {
        if(this.textLastName.length > 0){
          this.textLastName = ''
        }
      } else if (text === 'issue') {
        if(this.textIssue.length > 0){
          this.textIssue = ''
        }
      }
    },
    testForm () {
      this.email.length === 0 ? this.textEmail = '* Champ requis' : this.textEmail = ''
      this.firstName.length === 0 ? this.textFirstName = '* Champ requis' : this.textFirstName = ''
      this.lastName.length === 0 ? this.textLastName = '* Champ requis' : this.textLastName = ''
      this.issue.length === 0 ? this.textIssue = '* Champ requis' : this.textIssue = ''
    },
    submitForm () {
      if (this.email.length === 0 || this.firstName.length === 0 || this.lastName.length === 0 || this.issue.length === 0) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
        this.testForm()
      } else {
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
                  if(this.$cookies.isKey('user')){
                    if(this.$store.state.user.currentUser.infos.role.includes('admin')){
                      this.$store.dispatch('messageWaiting')
                    }
                  }
                })
                .catch(() => {
                  this.showAlertError('Une erreur est survenue, merci de réessayer ultérieurement !', '4000')
                })
      }
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
        position: 'center',
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
  .footerBg{
    overflow-x: hidden;
    background-image: url("../assets/img/bgfooter.png");
    background-size: cover;
  }
  a, a:hover{
    text-decoration: none;
  }
  .btn{
    color: black;
    background-color: transparent;
    border: none;
    height: 53px;
  }
  .modal-body .btn{
    height: auto;
  }
  .card-body{
    padding: 0;
  }
  .card{
    border: none;
  }
  .btn img{
    object-fit: scale-down;
    max-width: 100%;
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
