<template>
    <div id="login">
      <h1>Bienvenue sur notre réseau social !</h1>
      <div class="d-flex align-items-center justify-content-center">
        <b-tabs content-class="mt-3" id="tab1">
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
              <b-button pill type="submit" href="#" @click.prevent="logMe">Connexion</b-button>
            </div>
          </b-tab>
          <b-tab title="Inscription">
            <div class="formConnexion">
              <h2>Incrivez-vous !</h2>
              <b-form class="form" enctype="multipart/form-data">
                <b-form-group
                  id="input-group-3"
                  label="Adresse Email:"
                  label-for="input-3"
                >
                  <b-form-input
                    id="input-3"
                    type="email"
                    v-model="user.email"
                    required
                    placeholder="abcd@efg.com"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-4" label="Nom d'utilisateur :" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    required
                    v-model="user.username"
                    placeholder="Super Employee"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-5" label="Mot de passe :" label-for="input-5">
                  <b-form-input
                    id="input-5"
                    v-model="user.password"
                    required
                    type="password"
                    placeholder="********"
                  ></b-form-input>
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
                    :state="Boolean(file)"
                    placeholder="Choisissez votre photo de profil"
                    drop-placeholder="Déposez votre photo de profil"
                    browse-text="Rechercher"
                  ></b-form-file>
                </b-form-group>
              </b-form>
              <b-button pill type="submit" @click.prevent="registerMe">Inscription</b-button>
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
        email: null,
        password: null,
        username: null,
        bio: ''
      },
      file: null
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
    registerMe () {
      if (this.user.email === null || this.user.password === null || this.user.username === null) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
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
      if (this.user.email === null || this.user.password === null) {
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
  h1{
    margin: 2%;
    color: #2C3F5F;
  }
  #tab1{
    width: 500px;
    margin-bottom: 5%;
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
  }
</style>
