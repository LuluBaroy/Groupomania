<template>
  <div class="container p-2" id="containerbg">
    <h1 class="titleConfig rounded-pill mb-5">Compte utilisateur</h1>
    <div class="d-flex row align-items-center justify-content-center col-12 mb-5" id="userPart">
      <img :src="infos.url_profile_picture" class="userPhoto">
      <h2 class="col-4">{{ infos.username }}</h2>
    </div>
    <div class="d-flex flex-column align-items-center container">
      <h2 class="titleConfig rounded-pill col-12 p-2 mb-5">Ses publications</h2>
      <div v-if="userPosts.length === 0" class="d-flex flex-column align-items-center justify-content-md-between col-10">
        <h3 class="m-auto pt-3">{{ infos.username }} n'a rien posté !</h3>
        <p class="m-auto mt-2">Retrouvez toutes les publications sur le <router-link to="/wall">mur principal !</router-link></p>
        <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts">
      </div>
      <div class="d-flex mb-5 container-fluid row allPosts justify-content-center align-items-center" v-for="(post, index) in userPosts" :key="index">
        <div class="d-flex col-9 justify-content-center m-auto align-items-center formPart">
          <div class="d-flex col-9 flex-column">
            <h3 class="m-4">{{ post.title }}</h3>
            <p v-html="getLinks(post.content)"></p>
            <img :src="post.url_gif" v-if="post.url_gif" :alt="post.alt_gif" class="img-fluid imgPosts"/>
            <div class="d-flex row col-6 justify-content-around m-auto">
              <i v-if="!hasCommented(index)" v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="far fa-comments"><span>{{ post.Comments.length }}</span></i>
              <i v-else v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="fas fa-comments"><span>{{ post.Comments.length }}</span></i>
              <b-modal :id="'modalPost' + index + 'comments'" title="Commentaire(s) du post" @close="getUserPosts()" @cancel="getUserPosts()" @ok="getUserPosts()">
                <div class="my-4 commentsConfig" v-for="(comment, indexComment) in comments" :key="comment.id">
                  <div class="d-flex justify-content-end flex-column" v-if="comment.PostId === userPosts[index].id">
                    <i class="far fa-flag" v-b-modal="modalCommentId(index, indexComment, 'report')"></i>
                    <b-modal :id="'modalComment' + index + indexComment + 'report'" title="Signaler le contenu du Commentaire" @close="getComments(index)" @cancel="getComments(index)" @ok="getComments(index)">
                      <b-form-group class="d-flex flex-column col-12 mt-4">
                        <b-form-textarea
                          id="commentReport"
                          label="Signalement :"
                          placeholder="Expliquez nous le problème que vous rencontrez avec ce commentaire ..."
                          label-for="commentReport"
                          v-model="commentReport"
                          class="postInput"
                          required
                          rows="3"
                          max-rows="6"
                        ></b-form-textarea>
                        <b-button type="submit" @click.prevent="sendCommentReport(index, indexComment)" class="commentBtn">Envoyer</b-button>
                      </b-form-group>
                    </b-modal>
                    <div class="col-12 row justify-content-sm-between align-items-center comment">
                      <div class="userComment d-flex flex-column">
                        <router-link :to="`/profile/${comment.UserId}`"><img :src="comment.User.url_profile_picture" :alt="comment.User.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                        <h4>{{ comment.User.username}}</h4>
                      </div>
                      <div class="commentText">{{ comment.comment }}</div>
                    </div>
                    <div class="d-flex row justify-content-center" v-if="comment.User.id === currentUser.id">
                      <i v-b-modal="modalCommentId(index, indexComment, 'delete')" class="fas fa-trash-alt"><span>Supprimer le commentaire</span></i>
                      <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalComment' + index + indexComment + 'delete'" title="Suppression du Commenntaire" @ok="deleteComment(index, indexComment), showAlertSuccess('Commentaire supprimé !')">
                        <div class="my-4">
                          Êtes vous sûr(e) de vouloir supprimer ce commentaire ?
                        </div>
                      </b-modal>
                      <i v-b-modal="modalCommentId(index, indexComment, 'update')" class="far fa-edit" @click="setCommentValue(indexComment, index)"><span>Modifier le commentaire</span></i>
                      <b-modal ok-only ok-title="Cancel" :id="'modalComment' + index + indexComment + 'update'" title="Modification du Commentaire">
                        <div class="my-4">
                          <b-form enctype="multipart/form-data">
                            <b-form-group>
                              <b-form-textarea
                                id="commentUpdate"
                                label="Contenu de votre Commentaire :"
                                label-for="commentUpdate"
                                required
                                v-model="userComment.comment"
                                class="postInput"
                                rows="3"
                                max-rows="6"
                              ></b-form-textarea>
                              <b-button type="submit" @click.prevent="updateComment(index, indexComment), showAlertSuccess('Commentaire modifié !')" class="commentBtn">Modifier</b-button>
                            </b-form-group>
                          </b-form>
                        </div>
                      </b-modal>
                    </div>
                  </div>
                </div>
                <div>
                  <button type="button" class="btn commentBtn" @click="showTextArea()">Ajouter un commentaire</button>
                  <b-form-group v-if="userComment.clicked">
                    <b-form-textarea
                      label="Votre commentaire :"
                      label-for="userComment"
                      id="userComment"
                      required
                      v-model="userComment.comment"
                      placeholder="Entrez votre commentaire ..."
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <b-button type="submit" @click.prevent="addComment(index)" class="commentBtn">Commenter</b-button>
                  </b-form-group>
                </div>
              </b-modal>
              <i v-if="!hasAlreadyLiked(index)" v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
              <i v-else v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="fas fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
              <b-modal ok-only ok-title="Fermer" ok-variant="warning" :id="'modalLike' + index + 'like'" title="Like(s) du post" @ok="getUserPosts()" @close="getUserPosts()">
                <div class="my-4 d-flex row align-items-center col-12 justify-content-between" v-for="like in likes" :key="like.id" id="like">
                  <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                  <h4 class="d-flex username">{{ like.username }}</h4>
                </div>
                <b-btn pill class="d-flex m-auto" :variant="btnLikeVariant" @click="createLike(index), showAlertSuccess()">{{ btnLike }}</b-btn>
              </b-modal>
            </div>
          </div>
        </div>
        <div class="col-2">
          <i class="far fa-flag" v-b-modal="modalPostId(index, 'report')"><span>Signaler le post</span></i>
          <b-modal :id="'modalPost' + index + 'report'" title="Signaler le contenu du Post" @close="getUserPosts" @cancel="getUserPosts" @ok="getUserPosts">
            <b-form-group class="d-flex flex-column col-12 mt-4">
              <b-form-textarea
                id="postReport"
                label="Signalement :"
                placeholder="Expliquez nous le problème que vous rencontrez avec ce post ..."
                label-for="postReport"
                v-model="postReport"
                class="postInput"
                required
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <b-button type="submit" @click.prevent="sendPostReport(index)" class="commentBtn">Envoyer</b-button>
            </b-form-group>
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import linkifyHTML from 'linkifyjs/html'

export default {
  name: 'accountOtherUser',
  data () {
    return {
      infos: {},
      posts: {},
      likes: '',
      btnLike: '',
      btnLikeVariant: '',
      userComment: {
        comment: null,
        clicked: false
      },
      commentReport: null,
      postReport: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    },
    userPosts () {
      let userPosts = this.$store.state.posts.allPostsFromUser
      if (userPosts.length > 1) {
        return userPosts.reverse()
      } else {
        return userPosts
      }
    },
    comments () {
      return this.$store.state.posts.allComments
    }
  },
  methods: {
    getLinks (el) {
      return linkifyHTML(el)
    },
    hasAlreadyLiked (index) {
      if (this.userPosts[index].Likes.filter(like => like.user_id === this.currentUser.id).length !== 0) {
        return true
      }
    },
    hasCommented (index) {
      if (this.userPosts[index].Comments.filter(comment => comment.user_id === this.currentUser.id).length !== 0) {
        return true
      }
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    showAlertSuccess (title) {
      this.$swal({
        title: title,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    modalPostId (index, text) {
      return 'modalPost' + index + text
    },
    modalCommentId (index, indexComment, text) {
      return 'modalComment' + index + indexComment + text
    },
    modalLikeId (index, text) {
      return 'modalLike' + index + text
    },
    getUserPosts () {
      this.$store.dispatch('posts/getAllPostsFromOneUser', this.$route.params.id)
    },
    sendPostReport (index) {
      if (this.postReport === null) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        let payload = {
          id: this.userPosts[index].id,
          newReport: {
            report: null
          }
        }
        let newReport = ''
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
        if (regex.test(this.postReport)) {
          newReport = this.postReport.replace(regex, ' ')
        }
        if (newReport.length !== 0) {
          payload.newReport.report = newReport.toString()
        } else {
          payload.newReport.report = this.postReport.toString()
        }
        this.showAlertSuccess('Post signalé !')
        this.$store.dispatch('posts/sendPostReport', payload)
          .then(() => {
            this.postReport = null
          }).catch(error => {
            if (error.message.split('code ')[1].includes('500')) {
              this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
            } else if (error.message.split('code ')[1].includes('400')) {
              this.showAlertError(`Nous n'avons pas pu vous identifier, merci de vous connecter ou de créer un compte !`, '3500')
            }
          })
      }
    },
    getComments (index) {
      console.log(this.userPosts)
      let postId = this.userPosts[index].id
      this.$store.dispatch('posts/getComments', postId)
        .catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    showTextArea () {
      this.userComment.clicked = true
    },
    addComment (index) {
      if (this.userComment.comment === null) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
        let newComment = ''
        let postId = this.userPosts[index].id
        let payload = {
          id: postId,
          newComment: {
            comment: null
          }
        }
        if (regex.test(this.userComment.comment)) {
          newComment = this.userComment.comment.replace(regex, ' ')
        }
        if (newComment.length !== 0) {
          payload.newComment.comment = newComment.toString()
        } else {
          payload.newComment.comment = this.userComment.comment.toString()
        }
        this.showAlertSuccess('Commentaire ajouté !')
        this.$store.dispatch('posts/createComment', payload)
          .then(() => {
            this.userComment.clicked = false
            this.userComment.comment = ''
            this.getComments(index)
          }).catch(() => {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          })
      }
    },
    setCommentValue (indexComment, index) {
      let payload = {
        id: this.userPosts[index].id,
        commentId: this.comments[indexComment].id
      }
      this.$store.dispatch('posts/getOneComment', payload)
        .then(comment => {
          document.getElementById('commentUpdate').innerText = comment.data.comment
        }).catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    updateComment (index, indexComment) {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
      let newComment = ''
      let postId = this.userPosts[index].id
      let payload = {
        id: postId,
        commentId: this.comments[indexComment].id,
        newComment: {
          comment: null
        }
      }
      if (regex.test(this.userComment.comment)) {
        newComment = this.userComment.comment.replace(regex, ' ')
      }
      if (newComment.length !== 0) {
        payload.newComment.comment = newComment.toString()
      } else {
        payload.newComment.comment = this.userComment.comment.toString()
      }
      this.$store.dispatch('posts/updateComment', payload)
        .then(() => {
          this.getComments(index)
          this.userComment.comment = ''
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('403')) {
            this.showAlertError(`Vous n'avez pas le droit de modifier ce commentaire, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
          } else if (error.message.split('code ')[1].includes('404')) {
            this.showAlertError(`Ce commentaire n'existe pas !`, '1500')
          }
        })
    },
    deleteComment (index, indexComment) {
      let payload = {
        id: this.userPosts[index].id,
        commentId: this.comments[indexComment].id
      }
      this.$store.dispatch('posts/deleteComment', payload)
        .then(() => {
          this.getComments(index)
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('403')) {
            this.showAlertError(`Vous n'avez pas le droit de supprimer ce commentaire, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
          } else if (error.message.split('code ')[1].includes('404')) {
            this.showAlertError(`Ce commentaire n'existe pas !`, '1500')
          }
        })
    },
    sendCommentReport (index, indexComment) {
      if (this.commentReport === null) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        let payload = {
          id: this.userPosts[index].id,
          commentId: this.comments[indexComment].id,
          newReport: {
            report: null
          }
        }
        let newReport = ''
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
        if (regex.test(this.commentReport)) {
          newReport = this.commentReport.replace(regex, ' ')
        }
        if (newReport.length !== 0) {
          payload.newReport.report = newReport.toString()
        } else {
          payload.newReport.report = this.commentReport.toString()
        }
        this.showAlertSuccess('Commentaire signalé !')
        this.$store.dispatch('posts/sendCommentReport', payload)
          .then(() => {
            this.commentReport = null
          }).catch(() => {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          })
      }
    },
    getLikes (index) {
      let postId = this.userPosts[index].id
      this.$store.dispatch('posts/getLikes', postId)
        .then(response => {
          let id = []
          for (let i in response.data) {
            id.push(response.data[i].id)
          }
          if (id.includes(this.currentUser.id)) {
            this.btnLike = 'Disliker'
            this.btnLikeVariant = 'danger'
          } else {
            this.btnLikeVariant = 'info'
            this.btnLike = 'Liker'
          }
          this.likes = response.data
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('400')) {
            this.showAlertError(`Nous n'avons pas pu vous identifier, merci de vous connecter ou de créer un compte !`, '3500')
          }
        })
    },
    createLike (index) {
      let postId = this.userPosts[index].id
      this.$store.dispatch('posts/createLike', postId)
        .then(() => {
          this.getLikes(index)
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('400')) {
            this.showAlertError(`Nous n'avons pas pu vous identifier, merci de vous connecter ou de créer un compte !`, '3500')
          }
        })
    }
  },
  beforeMount () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('user/getOneUser', this.$route.params.id)
        .then(response => {
          this.infos = response.data
          this.$store.dispatch('posts/getAllPostsFromOneUser', this.infos.id)
            .then(posts => {
              this.posts = posts.data
            })
        })
    }
  }
}
</script>

<style scoped>
  h1{
    padding: 2% 0;
    font-size: 35px;
  }
  h2{
    font-size: 25px;
  }
  h3{
    font-size: 22px;
  }
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
    padding: 2%;
    margin: 2% 0;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  .allPosts{
    flex: 0 0 100%;
  }
  i{
    font-size: 20px;
  }
  .fa-flag span{
    font-size: 15px;
  }
  #containerbg{
    box-shadow: 0 0 12px black;
    background-color: #F7F7F7;
  }
  #userPart{
    margin: 2% 0;
    flex: 0 0 20%;
  }
  .userPhoto{
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
</style>
