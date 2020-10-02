<template>
  <div class="container-fluid p-2 footerBg flex-column flex-md-row">
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
              <b-form-input id="lastName" placeholder="Entrez votre nom" v-model="lastName" @keyup="testFormInput('lastName')"></b-form-input>
              <div v-if="textLastName.length !== 0" style="color: red;">{{textLastName}}</div>
              <div v-if="validation.lastName.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.lastName }}</div>
              <div v-if="isValidLastName === true" class="mt-2"><i class="far fa-check-circle"></i></div>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="firstNameG"
              label="Prénom :"
              label-for="firstName"
              align="center"
            >
              <b-form-input placeholder="Entrez votre prénom" id="firstName" v-model="firstName" @keyup="testFormInput('firstName')"></b-form-input>
              <div v-if="textFirstName.length !== 0" style="color: red;">{{textFirstName}}</div>
              <div v-if="validation.firstName.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.firstName }}</div>
              <div v-if="isValidFirstName === true" class="mt-2"><i class="far fa-check-circle"></i></div>
            </b-form-group>
          </div>
          <div>
            <b-form-group
              id="emailG"
              label="Email :"
              label-for="email"
              align="center"
            >
              <b-form-input placeholder="Entrez votre email" id="email" v-model="email" @keyup="testFormInput('email')"></b-form-input>
              <div v-if="textEmail.length !== 0" style="color: red;">{{textEmail}}</div>
              <div v-if="validation.email.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.email }}</div>
              <div v-if="isValidEmail === true" class="mt-2"><i class="far fa-check-circle"></i></div>
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
                @keyup="testFormInput('issue')"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <div v-if="textIssue.length !== 0" style="color: red;">{{textIssue}}</div>
              <div v-if="validation.issue.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.issue }}</div>
              <div v-if="isValidIssue === true" class="mt-2"><i class="far fa-check-circle"></i></div>
            </b-form-group>
          </div>
          <b-button variant="info" pill type="submit" @click.prevent="testForm(), submitForm()" class="d-flex m-auto" id="submitIssue">Envoyer</b-button>
        </b-card>
      </b-collapse>
    </b-modal>

    <!--LINK TO FAQ-->
    <b-button class="col-md-3"><router-link :to="{name: 'faq'}"><span>FAQ</span></router-link></b-button>
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
      },
      isValidFirstName: false,
      isValidLastName: false,
      isValidEmail: false,
      isValidIssue: false
    }
  },
  methods: {
    testFormInput (text) {
      // eslint-disable-next-line no-useless-escape
      let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      // eslint-disable-next-line no-useless-escape
      let regexNoCode = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      let regexNames = new RegExp(/[A-Za-z -']{2,25}/)
      if(text === 'email') {
        if(this.textEmail.length > 0){
          this.textEmail = ''
        }
        if(!regexEmail.test(this.email) || regexNoCode.test(this.email)){
          this.validation.email = `Merci de renseigner un email valide`
          document.getElementById('email').style.border = '3px solid red'
          this.isValidEmail = false
        } else {
          this.validation.email = ''
          document.getElementById('email').style.border = '3px solid lightseagreen'
          this.isValidEmail = true
        }
      } else if (text === 'firstName'){
          if(this.textFirstName.length > 0){
            this.textFirstName = ''
          }
          if(regexNames.test(this.firstName) && !regexNoCode.test(this.firstName)){
            this.validation.firstName = ''
            document.getElementById('firstName').style.border = '3px solid lightseagreen'
            this.isValidFirstName = true
          } else {
            this.validation.firstName = `Merci de renseigner un prénom valide (espace, apostophe et tiret accepté)`
            document.getElementById('firstName').style.border = '3px solid red'
            this.isValidFirstName = false
          }
      } else if (text === 'lastName') {
        if(this.textLastName.length > 0){
          this.textLastName = ''
        }
        if(regexNames.test(this.lastName) && !regexNoCode.test(this.lastName)){
          this.validation.lastName = ''
          document.getElementById('lastName').style.border = '3px solid lightseagreen'
          this.isValidLastName = true
        } else {
          this.validation.lastName = `Merci de renseigner un nom valide (espace, apostophe et tiret acceptés)`
          document.getElementById('lastName').style.border = '3px solid red'
          this.isValidLastName = false
        }
      } else if (text === 'issue') {
        if(this.textIssue.length > 0){
          this.textIssue = ''
        }
        if(!regexNoCode.test(this.issue) && this.issue.length > 0){
          this.validation.issue = ''
          document.getElementById('issue').style.border = '3px solid lightseagreen'
          this.isValidIssue = true
        } else {
          this.validation.issue = `Merci de ne pas utiliser les caractères suivant: |/*+&#{[]})<>$£€%=^ `
          document.getElementById('issue').style.border = '3px solid red'
          this.isValidIssue = false
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
          lastName: '',
          firstName: '',
          email: '',
          issue: ''
        }
        this.$store.dispatch('createIssue', data)
                .then(() => {
                  this.hideModal()
                  this.showAlertSuccess('Votre demande a bien été envoyée !')
                  this.lastName = ''
                  this.firstName = ''
                  this.email = ''
                  this.issue = ''
                  this.isValidEmail = false
                  this.isValidFirstName = false
                  this.isValidLastName = false
                  this.isValidIssue = false
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
