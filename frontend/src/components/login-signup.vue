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
                    class="inputFocus"
                    :state="stateEmail"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Mot de passe :" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="user.password"
                    required
                    type="password"
                    placeholder="********"
                    class="inputFocus"
                    :state="statePassword"
                  ></b-form-input>
                </b-form-group>
              </b-form>
              <b-button pill v-if="error === false" id="connexionBtn" type="submit" href="#" @click.prevent="logMe" class="rounded-pill m-auto text-decoration-none" variant="light">Connexion</b-button>
              <countdown v-else :end-time="new Date().getTime() + 60000" @finish="error = false">
                <template v-slot:process="countdown">
                  <span>{{ `Merci de patienter ${countdown.timeObj.ceil.s} secondes` }}</span>
                </template>
              </countdown>
            </div>
          </b-tab>

          <!--SIGNUP FORM-->
          <b-tab title="Inscription">
            <div class="formConnexion">
              <h2>Inscrivez-vous !</h2>
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
                    :state="stateEmail"
                    @keyup="testInput('email')"
                    placeholder="abcd@efg.com"
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-3">
                    Merci de renseigner un email valide
                  </b-form-invalid-feedback>
                  <div v-if="textEmail.length !== 0" style="color: red;">{{textEmail}}</div>
                </b-form-group>
                <b-form-group id="input-group-4" label="Nom d'utilisateur :" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    required
                    v-model="user.username"
                    :state="stateUsername"
                    @keyup="testInput('username')"
                    placeholder="Super Employee"
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-4">
                    Merci de renseigner un nom d'utilisateur contenant au minimum 6 caractères ne contenant que des lettres et/ou chiffres (espace(s) accepté(s))
                  </b-form-invalid-feedback>
                  <div v-if="textUsername.length !== 0" style="color: red;">{{textUsername}}</div>
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
                    :state="statePassword"
                    placeholder="********"
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-5">
                    Merci de renseigner un mot de passe contenant au moins 8 caractères dont une majuscule et un chiffre
                  </b-form-invalid-feedback>
                  <div v-if="textPassword.length !== 0" style="color: red;">{{textPassword}}</div>
                </b-form-group>

                <b-form-group id="input-group-6" label="Biographie (optionnel) :" label-for="input-6">
                  <b-form-textarea
                    id="textarea"
                    v-model="user.bio"
                    :placeholder="`Exemple : Je m'appelle ${user.username || '...'} J'occupe le poste de ... `"
                    rows="3"
                    max-rows="6"
                    :state="stateBio"
                  ></b-form-textarea>
                  <b-form-invalid-feedback>
                    Merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group
                        label="Photo de profil (optionnel) :"
                        label-for="input-7">
                  <img v-if="url.length > 0" :src="url" alt="Prévisualisation de la photo de profil" class="userPhoto d-flex mr-auto ml-auto mb-3"/>
                  <b-form-file id="fileInput" v-model="file" accept=".jpg, .png, .gif, .jpeg" class="text-left mr-auto ml-auto" @change="onFileChanged"></b-form-file>
                  <small>Fichiers acceptés : 'jpg', 'jpeg', 'gif', 'png'</small>
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
      textEmail: '',
      textPassword: '',
      textUsername: '',
      error: false,
      url: ''
    }
  },
  computed: {
    stateEmail () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      if(regex.test(this.user.email)){
        return true
      } else if (!regex.test(this.user.email) && this.user.email.length !== 0) {
        return false
      } else {
        return null
      }
    },
    statePassword () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}/)
      if(this.user.password.length < 8 && this.user.password.length > 0 || this.user.password.length > 0 && !regex.test(this.user.password)){
        return false
      } else if (this.user.password.length > 8 && regex.test(this.user.password) || this.user.password.length === 8 && regex.test(this.user.password)){
        return true
      } else {
        return null
      }
    },
    stateUsername () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`.]/)
      // eslint-disable-next-line no-useless-escape
      let regex2 = new RegExp(/[a-zA-Z0-9_ ]{6,16}/)
      if (this.user.username.length > 0 && this.user.username.length < 6 || this.user.username.length > 0 && regex.test(this.user.username) || this.user.username.length > 0 && !regex2.test(this.user.username)){
        return false
      } else if (this.user.username.length > 6 && regex2.test(this.user.username) && !regex.test(this.user.username) || this.user.username.length === 6 && regex2.test(this.user.username) && !regex.test(this.user.username)){
        return true
      } else {
        return null
      }
    },
    stateBio () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/)
      if(this.user.bio.length > 0 && !regex.test(this.user.bio)){
        return true
      } else if (this.user.bio.length > 0 && regex.test(this.user.bio) || regex.test(this.user.bio)){
        return false
      } else {
        return null
      }
    }
  },
  beforeMount () {
    if(this.$cookies.isKey('user')) {
      this.$router.push({name: 'wall'})
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
      if(text === 'email'){
        if(this.textEmail.length > 0){
          this.textEmail = ''
        }
      } else if (text === 'username') {
        if(this.textUsername.length > 0){
          this.textUsername = ''
        }
      } else if (text === 'password') {
        if(this.textPassword.length > 0){
          this.textPassword = ''
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
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      if (this.stateEmail !== true || this.stateUsername !== true || this.statePassword !== true || this.file !== null && !authorizedFile.includes(this.file.name.split('.')[1]) || this.stateBio === false) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
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
        this.state = true
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
              this.error = true
              this.showAlertError('Trop de tentatives de connexion, merci de patienter 1 minute avant de réessayer', '2500')
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

<style scoped>
  .nav-link:focus, .nav-link:hover{
    background-color: #0080C0;
    color: whitesmoke;
  }
  .nav-tabs .nav-link.active:focus, .nav-tabs .nav-link.active:hover{
    background-color: #0080C0;
    color: whitesmoke;
  }
  #login{
    flex-grow: 1;
  }
  .invalid-feedback{
    font-size: 1em !important;
    color: #f17884;
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
  .userPhoto{
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 4px solid white;
    box-shadow: 0 0 12px white;
  }
</style>
