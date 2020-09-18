<template>
  <section class="d-flex row container pb-5" id="accountParam">
    <h2 class="col-12 rounded-pill p-2 titleConfig mb-5">Administrateur</h2>
    <div class="col-6 d-flex flex-column justify-content-around mb-5">
      <h3>Messages de la rubrique "Nous Contacter"</h3>
      <b-button v-b-modal.allIssues @click="getIssues(), getPending()" variant="info" class="m-auto">Voir les messages</b-button>
      <b-modal id="allIssues" title="Messages" ok-only ok-title="Fermer">
        <b-tabs>
          <b-tab title="Tous les messages">
            <div v-if="allIssues !== null" v-for="(issue, index) in allIssues" :key="index" class="d-flex flex-column m-auto">
              <b-list-group>
                <b-list-group-item button id="showIssue" class="d-flex m-auto" v-b-toggle="issueId(index)">
                  <h4 class="col-2">N°{{ allIssues[index].id }}</h4><br>
                  <p v-if="issue.status === 'pending'" class="d-flex col-6 justify-content-center pending">En attente de traitement</p>
                  <p v-else class="d-flex col-6 justify-content-center treated">Traité</p><br>
                  <p class="openBtn col-4">Ouvrir</p>
                </b-list-group-item>
                <b-collapse :id="'issueId' + index" class="mt-4">
                  <b-card>
                    <p>Créé le : {{ issue.createdAt.split(' ')[0].split('-')[2] }}-{{ issue.createdAt.split(' ')[0].split('-')[1] }}-{{ issue.createdAt.split(' ')[0].split('-')[0] }} à {{ issue.createdAt.split(' ')[1].split(':')[0] }}h{{ issue.createdAt.split(':')[1].split(':')[0] }}</p>
                    <p>Prénom / Nom : {{ issue.firstName }} {{ issue.lastName }}</p>
                    <p>Email: {{ issue.email }}</p>
                    <p>Sa / Ses question(s) : {{ issue.issue }}</p>
                    <p>Actuellement : <span v-if="issue.status === 'pending'" class="pending">En attente de traitement</span><span v-else class="treated">Traité</span></p>
                    <b-button class="d-flex m-auto" v-if="issue.status === 'pending'" pill variant="info" @click="updateIssue(index)">Mettre à jour le statut du message</b-button>
                  </b-card>
                </b-collapse>
              </b-list-group>
            </div>
            <div v-else>{{ allIssues }}</div>
          </b-tab>
          <b-tab title="Messages en attente de traitement">
            <div v-if="allPending !== null">
              <div v-for="(pending, index) in allPending" :key="index" class="d-flex flex-column m-auto">
                <b-list-group>
                  <b-list-group-item button id="showPending" class="d-flex m-auto" v-b-toggle="pendingId(index)">
                    <h4 class="col-2">N°{{ allPending[index].id }}</h4><br>
                    <p class="d-flex col-6 justify-content-center pending">En attente de traitement</p>
                    <p class="openBtn col-4">Ouvrir</p>
                  </b-list-group-item>
                  <b-collapse :id="'pendingId' + index" class="mt-4">
                    <b-card>
                      <p>Créé le : {{ pending.createdAt.split(' ')[0].split('-')[2] }}-{{ pending.createdAt.split(' ')[0].split('-')[1] }}-{{ pending.createdAt.split(' ')[0].split('-')[0] }} à {{ pending.createdAt.split(' ')[1].split(':')[0] }}h{{ pending.createdAt.split(':')[1].split(':')[0] }}</p>
                      <p>Prénom / Nom : {{ pending.firstName }} {{ pending.lastName }}</p>
                      <p>Email: {{ pending.email }}</p>
                      <p>Sa / Ses question(s) : {{ pending.issue }}</p>
                      <p>Actuellement : <span class="pending">En attente de traitement</span></p>
                      <b-button class="d-flex m-auto" pill variant="info" @click="updateIssue(index)">Mettre à jour le statut du message</b-button>
                    </b-card>
                  </b-collapse>
                </b-list-group>
              </div>
            </div>
            <div v-else class="d-flex col-12 align-items-center justify-content-center mt-3">Vous n'avez pas de message en attente de traitement !</div>
          </b-tab>
        </b-tabs>
      </b-modal>
    </div>
    <div class="col-6">
      <h3>Signalements de contenu</h3>
      <b-button v-b-modal.allReports @click="getAllReports(), getAllPendingReports(), isClicked = true">Voir les signalements</b-button>
      <b-modal ok-only @ok="getUserPosts" @close="getUserPosts" title="Signalements" id="allReports" v-if="isClicked">
        <b-tabs>
          <b-tab title="Posts">
            <div v-if="allReports !== null">
              <div v-for="(postReport, index) in allReports.postReports" :key="index">
                <b-list-group>
                  <b-list-group-item button class="d-flex m-auto" v-b-toggle="reportPostId(index)" @click="getUserInfo(index), getPost(index)">
                    <h4 class="col-2">N°{{ allReports.postReports[index].id }}</h4><br>
                    <p class="d-flex col-6 justify-content-center pending">En attente de traitement</p>
                    <p class="openBtn col-4">Ouvrir</p>
                  </b-list-group-item>
                  <b-collapse :id="'reportPostId' + index" class="mt-4">
                    <b-card class="d-flex flex-column m-auto">
                      <div class="border p-2">
                        <p>Créé le : {{ postReport.createdAt.split(' ')[0].split('-')[2] }}-{{ postReport.createdAt.split(' ')[0].split('-')[1] }}-{{ postReport.createdAt.split(' ')[0].split('-')[0] }} à {{ postReport.createdAt.split(' ')[1].split(':')[0] }}h{{ postReport.createdAt.split(':')[1].split(':')[0] }}</p>
                        <p class="mt-3"><span class="pending">Signalement : </span>{{ postReport.report }}</p>
                        <b-button class="d-flex btnUserReport" v-b-toggle="userId(index)" variant="info">Infos de l'utilisateur</b-button>
                        <b-collapse :id="'user' + index">
                          <div class="userComment d-flex row align-items-center mb-5 mt-3">
                            <router-link :to="`/profile/${userInfo.id}`"><img :src="userInfo.profile_picture" :alt="userInfo.alt_picture" class="img-fluid imgComment"/></router-link>
                            <h5>{{ userInfo.username}}</h5>
                          </div>
                        </b-collapse>
                        <b-button class="d-flex btnUserReport" v-b-toggle="postId(index)" variant="info">Aperçu du post</b-button>
                        <b-collapse :id="'post' + index" class="mt-3 mb-5">
                          <div class="d-flex formPart flex-column col-10 m-auto text-break">
                            <h4 class="d-flex m-auto">{{ postInfo.title }}</h4>
                            <p class="d-flex m-auto">{{ postInfo.content }}</p>
                            <img :src="postInfo.url_gif" :alt="postInfo.alt_gif" class="img-fluid imgPosts mt-3"/>
                          </div>
                        </b-collapse>
                      </div>
                      <div>
                        <div class="d-flex flex-column border p-2">
                          <h5 class="col-12 text-center">Options pour le post</h5>
                          <div class="accordion" role="tablist">
                            <b-card no-body class="mb-1">
                              <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle.accordion-1 variant="primary" @click="setPostValue(index)">Editer le post signalé</b-button>
                              </b-card-header>
                              <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                                <b-card-body>
                                  <b-form enctype="multipart/form-data">
                                    <b-form-group>
                                      <b-form-input
                                        id="titleUpdate"
                                        label="Titre de votre Post"
                                        label-for="userPostTitle"
                                        v-model="userPost.title"
                                        value="userPost.title"
                                        required
                                        class="postInput"
                                      ></b-form-input>
                                      <b-form-textarea
                                        id="contentUpdate"
                                        label="Contenu de votre Post :"
                                        label-for="userPostContent"
                                        v-model="userPost.content"
                                        required
                                        class="postInput"
                                        rows="3"
                                        max-rows="6"
                                      >{{ userPost.content }}</b-form-textarea>
                                      <div id="postUpdate">
                                        <img :src="userPost.img" v-if="url.length === 0" class="img-fluid imgPosts d-flex" id="updateImg" :alt="userPost.altImg"/>
                                        <img v-else :src="url" class="img-fluid imgPosts d-flex" alt="Preview new image">
                                        <b-form-file v-model="file" class="mt-3" plain @change="onFileChanged"></b-form-file>
                                      </div>
                                      <b-button type="submit" @click.prevent="updatePost(index)" class="commentBtn">Modifier</b-button>
                                    </b-form-group>
                                  </b-form>
                                </b-card-body>
                              </b-collapse>
                            </b-card>

                            <b-card no-body class="mb-1">
                              <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle.accordion-2 variant="danger" @click="deletePost(index)">Supprimer le post signalé</b-button>
                              </b-card-header>
                              <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                                <b-card-body>
                                  <b-card-text></b-card-text>
                                </b-card-body>
                              </b-collapse>
                            </b-card>
                          </div>
                        </div>
                        <div class="d-flex flex-column border p-2" v-if="postReport.status.includes('pending')">
                          <h5 class="col-12 text-center">Option(s) pour le signalement</h5>
                          <b-button class="btnUserReport" variant="success">Mettre à jour le signalement</b-button>
                        </div>
                      </div>
                    </b-card>
                  </b-collapse>
                </b-list-group>
              </div>
            </div>
          </b-tab>
          <b-tab title="Commentaires">
            <div v-if="allReports !== null">
              <div v-for="(commentReport, index) in allReports.commentReports" :key="index">
                {{ index }}
              </div>
            </div>
          </b-tab>
          <b-tab title="En attente">
            789
          </b-tab>
        </b-tabs>
      </b-modal>
    </div>
  </section>
</template>
<script>
import linkifyHTML from 'linkifyjs/html'

export default {
  name: 'accountAdmin',
  data () {
    return {
      allIssues: null,
      allPending: null,
      allReports: null,
      allReportsPending: null,
      postInfo: '',
      userInfo: {
        id: null,
        username: null,
        profile_picture: null,
        alt_picture: null
      },
      userPost: {
        title: '',
        content: '',
        img: '',
        alt_img: ''
      },
      url: '',
      file: null,
      isClicked: false
    }
  },
  methods: {
    getLinks (el) {
      return linkifyHTML(el)
    },
    getUserPosts () {
      this.$store.dispatch('posts/getAllPostsFromOneUser', this.$route.params.id)
    },
    onFileChanged (e) {
      const file = e.target.files[0]
      this.url = URL.createObjectURL(file)
    },
    getIssues () {
      this.$store.dispatch('readAllIssues')
        .then(response => {
          if (!response.data.message) {
            this.allIssues = response.data.reverse()
          } else if (response.data.message) {
            this.allIssues = null
          }
        })
    },
    getPending () {
      this.$store.dispatch('readAllPending')
        .then(response => {
          if (!response.data.message) {
            this.allPending = response.data.reverse()
          } else if (response.data.message) {
            this.allPending = null
          }
        })
    },
    updateIssue (index) {
      let issueId = this.allIssues[index].id
      this.$store.dispatch('updateIssue', issueId)
        .then(() => {
          this.getIssues()
          this.getPending()
        })
    },
    issueId (index) {
      return 'issueId' + index
    },
    pendingId (index) {
      return 'pendingId' + index
    },
    reportPostId (index) {
      return 'reportPostId' + index
    },
    postId (index) {
      return 'post' + index
    },
    userId (index) {
      return 'user' + index
    },
    getAllReports () {
      this.$store.dispatch('readAllReports')
        .then(response => {
          this.allReports = response.data
        })
    },
    getAllPendingReports () {
      this.$store.dispatch('readAllPendingReports')
        .then(() => {
        })
    },
    showAlertSuccess (title, timer) {
      this.$swal({
        title: title,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: timer})
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    getUserInfo (index) {
      let userId = this.allReports.postReports[index].UserId
      this.$store.dispatch('user/getOneUser', userId)
        .then((response) => {
          this.userInfo.id = response.data.id
          this.userInfo.username = response.data.username
          this.userInfo.profile_picture = response.data.url_profile_picture
          this.userInfo.alt_picture = response.data.alt_profile_picture
          console.log(this.userInfo)
        })
    },
    getPost (index) {
      let postId = this.allReports.postReports[index].PostId
      this.$store.dispatch('posts/getOnePost', postId)
        .then(response => {
          this.postInfo = response.data
          console.log(this.postInfo)
        }).catch(err => console.log(err))
    },
    setPostValue (index) {
      let postId = this.allReports.postReports[index].PostId
      this.$store.dispatch('posts/getOnePost', postId)
        .then(post => {
          this.userPost.title = post.data.title
          this.userPost.content = post.data.content
          this.userPost.img = post.data.url_gif
          this.userPost.altImg = post.data.alt_url_gif
        }).catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    updatePost (index) {
      let postId = this.allReports.postReports[index].PostId
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
      let newTitle = ''
      let newContent = ''
      if (regex.test(this.userPost.title)) {
        newTitle = this.userPost.title.replace(regex, ' ')
      }
      if (regex.test(this.userPost.content)) {
        newContent = this.userPost.content.replace(regex, ' ')
      }
      let formData = new FormData()
      if (newTitle.length !== 0) {
        formData.append('title', newTitle.toString())
      } else {
        formData.append('title', this.userPost.title.toString())
      }
      if (newContent.length !== 0) {
        formData.append('content', newContent.toString())
      } else {
        formData.append('content', this.userPost.content.toString())
      }
      formData.append('image', this.file)
      let payload = {
        id: postId,
        data: formData
      }
      this.$store.dispatch('posts/updatePost', payload)
        .then(() => {
          this.setPostValue(index)
          this.showAlertSuccess('Post modifié !', '1500')
          this.getPost(index)
          this.file = null
          this.userPost.title = ''
          this.userPost.content = ''
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('403')) {
            this.showAlertError(`Vous n'avez pas le droit de modifier ce post, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
          } else if (error.message.split('code ')[1].includes('404')) {
            this.showAlertError(`Ce post n'existe pas !`, '1500')
          } else if (error.message.split('code ')[1].includes('401')) {
            this.showAlertError(`Nous n'avons pas pu vous identifier, merci de vous connecter ou de créer un compte !`, '2500')
          }
        })
    },
    deletePost (index) {
      let postId = this.allReports.postReports[index].PostId
      this.$store.dispatch('posts/deletePost', postId)
        .then(() => {
          this.showAlertSuccess(`Le post signalé a été supprimé ainsi que :\n
          - Son signalement\n
          - Ses Likes\n
          - Ses commentaires\n
          - Ses commentaires signalés\n
          - Les signalements des commentaires de ce post`, '5500')
          this.isClicked = false
          this.getAllReports()
          this.isClicked = true
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('401')) {
            this.showAlertError(`Vous n'avez pas le droit de supprimer ce post, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
          }
        })
    }
  }
}
</script>
<style scoped>
  .btnUserReport{
    margin: 3% auto;
  }
  #showIssue{
    color: #2C3F5F;
  }
  .pending{
    color: brown;
  }
  .treated{
    color: darkcyan;
  }
  .openBtn{
    text-decoration: underline;
  }
  h2{
    font-size: 25px;
  }
  h3{
    font-size: 20px;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
</style>
