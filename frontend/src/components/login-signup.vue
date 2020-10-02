<template>
    <div id="login">
      <h1 class="m-4">Bienvenue sur notre réseau social !</h1>
      <div class="d-flex align-items-center justify-content-center">
        <b-tabs content-class="mt-3 mb-5" id="tab1">

          <!--CONNEXION FORM-->
          <b-tab title="Connexion" active>
            <div class="formConnexion">
              <h2>Connectez-vous !</h2>
              <b-form class="form">
                <b-form-group
                  id="input-group-1"
                  label="Adresse Email:"
                  label-for="input-1"
                >
                  <b-form-input
                    id="input-1"
                    type="email"
                    v-model="user.email"
                    required
                    placeholder="abcd@efg.com"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Mot de passe :" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="user.password"
                    required
                    type="password"
                    placeholder="********"
                  ></b-form-input>
                </b-form-group>
              </b-form>
              <b-button pill type="submit" href="#" @click.prevent="logMe" class="rounded-pill m-auto text-decoration-none" variant="light">Connexion</b-button>
            </div>
          </b-tab>

          <!--SIGNUP FORM-->
          <b-tab title="Inscription">
            <div class="formConnexion">
              <h2>Incrivez-vous !</h2>
              <b-form class="form" enctype="multipart/form-data">
                <b-form-group
                  id="input-group-3"
                  label="Adresse Email:"
                  label-for="input-3">
                  <b-form-input
                    id="input-3"
                    type="email"
                    v-model="user.email"
                    required
                    @keyup="testInput('email')"
                    placeholder="abcd@efg.com"
                  ></b-form-input>
                  <div v-if="textEmail.length !== 0" style="color: red;">{{textEmail}}</div>
                  <div v-if="validation.email.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.email }}</div>
                  <div v-if="isValidEmail === true" class="mt-2"><i class="far fa-check-circle"></i></div>
                </b-form-group>
                <b-form-group id="input-group-4" label="Nom d'utilisateur :" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    required
                    v-model="user.username"
                    @keyup="testInput('username')"
                    placeholder="Super Employee"
                  ></b-form-input>
                  <div v-if="textUsername.length !== 0" style="color: red;">{{textUsername}}</div>
                  <div v-if="validation.username.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.username }}</div>
                  <div v-if="isValidUsername === true" class="mt-2"><i class="far fa-check-circle"></i></div>
                </b-form-group>

                <b-form-group
                        id="input-group-5"
                        label="Mot de passe :"
                        label-for="input-5">
                  <b-form-input
                    id="input-5"
                    v-model="user.password"
                    required
                    type="password"
                    @keyup="testInput('password')"
                    placeholder="********"
                  ></b-form-input>
                  <div v-if="textPassword.length !== 0" style="color: red;">{{textPassword}}</div>
                  <div v-if="validation.password.length !== 0" class="mt-2" style="color: red;"><i class="far fa-times-circle"></i> {{ validation.password }}</div>
                  <div v-if="isValidPassWord === true" class="mt-2"><i class="far fa-check-circle"></i></div>
                </b-form-group>

                <b-form-group id="input-group-6" label="Biographie (optionnel) :" label-for="input-6">
                  <b-form-textarea
                    id="textarea"
                    v-model="user.bio"
                    :placeholder="`Exemple : Je m'appelle ${user.username || '...'} J'occupe le poste de ... `"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group id="input-group-7" label="Photo de profil (optionnel) :" label-for="input-7">
                  <b-form-file
                    v-model="file"
                    placeholder="Choisissez votre photo de profil"
                    drop-placeholder="Déposez votre photo de profil"
                    browse-text="Rechercher"
                  ></b-form-file>
                </b-form-group>
              </b-form>
              <b-button pill type="submit" @click.prevent="testForm(), registerMe()" class="d-flex rounded-pill m-auto" variant="light">Inscription</b-button>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
</template>

<script>
export default {
  name: 'signUp',
  data () {
    return {
      user: {
        email: '',
        password: '',
        username: '',
        bio: ''
      },
      validation: {
        email: '',
        username: '',
        password: ''
      },
      file: null,
      isValidEmail: false,
      isValidPassWord: false,
      isValidUsername: false,
      textEmail: '',
      textPassword: '',
      textUsername: ''
    }
  },
  beforeMount () {
    if(this.$cookies.isKey('user')) {
      this.$router.push({name: 'wall'})
    }
  },
  methods: {
    testInput (text) {
      if(text === 'email'){
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        if(this.textEmail.length > 0){
          this.textEmail = ''
        }
        if(!regex.test(this.user.email)) {
          this.validation.email = `Merci de renseigner un email valide`
          document.getElementById('input-3').style.border = '3px solid red'
          this.isValidEmail = false
        } else {
          this.validation.email = ''
          document.getElementById('input-3').style.border = '3px solid lightseagreen'
          this.isValidEmail = true
        }

      } else if (text === 'username') {
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`.]/)
        let regex2 = new RegExp(/[a-zA-Z0-9_]{3,16}/)
        if(this.textUsername.length > 0){
          this.textUsername = ''
        }
        if(regex.test(this.user.username) || !regex2.test(this.user.username)){
          this.validation.username = `Merci de renseigner un nom d'utilisateur contenant au minimum 6 caractères ne contenant que des lettres et des chiffres (espace(s) accepté(s))`
          document.getElementById('input-4').style.border = '3px solid red'
          this.isValidUsername = false
        } else {
          this.validation.username = ''
          document.getElementById('input-4').style.border = '3px solid lightseagreen'
          this.isValidUsername = true
        }

      } else if (text === 'password') {
        if(this.textPassword.length > 0){
          this.textPassword = ''
        }
        let regex = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}/)
        if (!regex.test(this.user.password)) {
          this.validation.password = `Merci de renseigner un mot de passe contenant au moins 8 caractères dont une majuscule et un chiffre`
          document.getElementById('input-5').style.border = '3px solid red'
          this.isValidPassWord = false
        } else {
          this.validation.password = ''
          document.getElementById('input-5').style.border = '3px solid lightseagreen'
          this.isValidPassWord = true
        }
      }

    },
    testForm () {
      this.user.email.length === 0 ? this.textEmail = '* Champ requis' : this.textEmail = ''
      this.user.password.length === 0 ? this.textPassword = '* Champ requis' : this.textPassword = ''
      this.user.username.length === 0 ? this.textUsername = '* Champ requis' : this.textUsername = ''
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    registerMe () {
      if (this.user.email.length === 0 || this.user.password.length === 0 || this.user.username.length === 0) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
        this.testForm()
      } else {
        let formData = new FormData()
        formData.append('image', this.file)
        formData.append('email', this.user.email)
        formData.append('password', this.user.password)
        formData.append('username', this.user.username)
        formData.append('bio', this.user.bio)
        this.$store.dispatch('user/registerUser', formData)
          .then(() => {
            this.$store.dispatch('user/logUser', {email: this.user.email, password: this.user.password})
              .then(() => {
                this.$store.dispatch('user/getCurrentUser', this.$store.state.user.currentUser.id)
                  .then(() => {
                    this.$router.push('/wall/')
                  })
              })
          }).catch(error => {
            if (error.message.split('code ')[1].includes('422')) {
              this.showAlertError(`Merci de renseigner un email valide`, '2500')
            } else if (error.message.split('code ')[1].includes('500')) {
              this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
            } else if (error.message.split('code ')[1].includes('401')) {
              this.showAlertError(`Cet email est déjà utilisé !`, '1500')
            } else if (error.message.split('code ')[1].includes('400')) {
              this.showAlertError(`Merci de renseigner un mot de passe d'au moins 8 caractères avec au moins une majuscule et un chiffre`, '4500')
            }
          })
      }
    },
    logMe () {
      if (this.user.email.length === 0 || this.user.password.length === 0) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        let data = {
          email: this.user.email,
          password: this.user.password
        }
        this.$store.dispatch('user/logUser', data)
          .then(() => {
            this.$router.push('/wall')
              .then(() => {
                this.$store.dispatch('user/getCurrentUser', this.$store.state.user.currentUser.id)
              })
          }).catch((error) => {
            if (error.message.split('code ')[1].includes('401')) {
              this.showAlertError('Email ou mot de passe erroné !', '1500')
            } else if (error.message.split('code ')[1].includes('429')) {
              this.showAlertError('Trop de tentatives de connexion, merci de patienter 20 secondes avant de réessayer', '2500')
            } else if (error.message.split('code ')[1].includes('404')) {
              this.showAlertError(`Aucun compte n'est associé à cet email`, '2000')
            } else if (error.message.split('code ')[1].includes('422')) {
              this.showAlertError(`Merci de renseigner un email et/ou un mot de passe valide`, '2000')
            }
          })
      }
    }
  }
}
</script>

<style>
  #login{
    flex-grow: 1;
  }
  .fa-check-circle{
    color: lightseagreen;
    font-size: 1.3em;
  }
  .fa-times-circle{
    color: red;
    font-size: 1.3em;
  }
  h1{
    color: #2C3F5F;
  }
  #tab1{
    width: 500px;
  }
  .formConnexion{
    background-color: #2C3F5F;
    color: white;
    padding: 5%;
    border: 4px solid white;
    box-shadow: 0 0 12px black;
  }
  input{
    text-align: center;
    box-shadow: 0 0 3px lavender;
  }
</style>
