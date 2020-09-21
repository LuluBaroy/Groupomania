<template>
  <div class="d-flex flex-column col-12">
    <div v-if="posts.length === 0" class="col-8 m-auto">
      <h3>Aucun post n'a encore été publié ! Lancez vous !</h3>
      <p>Si vous ne savez pas comment faire, regardez le tutoriel dans le carrousel en haut de page ou retrouvez nos astuces dans la section FAQ !!</p>
      <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts">
    </div>
    <div id="postPart" class="row align-items-center justify-content-around mt-4" v-for="(post, index) in posts" :key="post.id">
      <div class="d-flex col-2 justify-content-center align-items-center flex-column">
        <div class="d-flex flex-column">
          <h3>{{ post.User.username }}</h3>
          <router-link :to="`/profile/${post.UserId}`"><img :src="post.User.url_profile_picture" :alt="post.User.alt_profile_picture" class="img-fluid userPhoto"/></router-link>
        </div>
        <div v-if="post.User.id === currentUser.id" class="flex-column justify-content-center" id="modifPost">
          <i v-b-modal="modalPostId(index, 'delete')" class="fas fa-trash-alt"><span>Supprimer le post</span></i>
          <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalPost' + index + 'delete'" title="Suppression du Post" @ok="deletePost(index), showAlertSuccess('Post supprimé !')">
            <div class="my-4">
              Êtes vous sûr(e) de vouloir supprimer ce post ?
            </div>
          </b-modal>
          <i v-b-modal="modalPostId(index, 'update')" class="far fa-edit" @click="setPostValue(index)"><span>Modifier le post</span></i>
          <b-modal ok-only ok-title="Cancel" :id="'modalPost' + index + 'update'" title="Modification du Post" @close="url = ''" @ok="url = ''">
            <div class="my-4">
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
                  <b-button type="submit" @click.prevent="updatePost(index), showAlertSuccess('Post modifié !')" class="commentBtn">Modifier</b-button>
                </b-form-group>
              </b-form>
            </div>
          </b-modal>
        </div>
      </div>
      <div class="d-flex formPart flex-column col-8">
        <h4>{{ post.title }}</h4>
        <p v-html="getLinks(post.content)"></p>
        <img :src="post.url_gif" :alt="post.alt_gif" class="img-fluid imgPosts"/>
        <div class="d-flex row justify-content-around">
          <div id="postInfo">
            <i class="far fa-flag" v-b-modal="modalPostId(index, 'report')"></i>
            <b-modal :id="'modalPost' + index + 'report'" title="Signaler le contenu du Post" @close="getPosts" @cancel="getPosts" @ok="getPosts">
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
          <div>
            <i v-if="!hasCommented(index)" v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="far fa-comments"><span>{{ post.Comments.length }}</span></i>
            <i v-else v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="fas fa-comments"><span>{{ post.Comments.length }}</span></i>
            <b-modal :id="'modalPost' + index + 'comments'" title="Commentaire(s) du post" @close="getPosts" @cancel="getPosts" @ok="getPosts">
              <div class="my-4 commentsConfig" v-for="(comment, indexComment) in comments" :key="comment.id">
                <div class="d-flex justify-content-end flex-column" v-if="comment.PostId === posts[index].id">
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
          </div>
          <div>
            <i v-if="!hasAlreadyLiked(index)" v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
            <i v-else v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="fas fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
            <b-modal ok-only ok-title="Fermer" ok-variant="warning" :id="'modalLike' + index + 'like'" title="Like(s) du post" @ok="getPosts(index)" @close="getPosts(index)">
              <div class="my-4 d-flex row align-items-center col-12 justify-content-between" v-for="like in likes" :key="like.id" id="like">
                <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                <h4 class="d-flex username">{{ like.username }}</h4>
              </div>
              <b-btn pill class="d-flex m-auto" :variant="btnLikeVariant" @click="createLike(index), showAlertSuccess()">{{ btnLike }}</b-btn>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import linkifyHTML from 'linkifyjs/html'
export default {
  name: 'postsPart',
  data () {
    return {
      userPost: {
        title: '',
        content: '',
        img: '',
        altImg: ''
      },
      modal: {
        title: '',
        content: ''
      },
      slide: 0,
      btnLike: '',
      btnLikeVariant: '',
      likeClass: '',
      sliding: null,
      file: null,
      likes: null,
      userComment: {
        comment: null,
        clicked: false
      },
      url: '',
      commentReport: null,
      postReport: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    },
    posts () {
      return this.$store.state.posts.allPosts
    },
    comments () {
      return this.$store.state.posts.allComments
    }
  },
  methods: {
    onFileChanged (e) {
      const file = e.target.files[0]
      this.url = URL.createObjectURL(file)
    },
    hasAlreadyLiked (index) {
      if (this.posts[index].Likes.filter(like => like.user_id === this.currentUser.id).length !== 0) {
        return true
      }
    },
    hasCommented (index) {
      if (this.posts[index].Comments.filter(comment => comment.user_id === this.currentUser.id).length !== 0) {
        return true
      }
    },
    showAlertSuccess (title) {
      this.$swal({
        title: title,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    getPosts () {
      this.$store.dispatch('posts/getAllPosts')
        .catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    getLinks (el) {
      return linkifyHTML(el)
    },
    setPostValue (index) {
      let postId = this.posts[index].id
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
      let postId = this.posts[index].id
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
          this.getPosts()
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
      let postId = this.posts[index].id
      this.$store.dispatch('posts/deletePost', postId)
        .then(() => {
          this.getPosts()
        }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('401')) {
            this.showAlertError(`Vous n'avez pas le droit de supprimer ce post, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
          }
        })
    },
    sendPostReport (index) {
      if (this.postReport === null) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        let payload = {
          id: this.posts[index].id,
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
      let postId = this.posts[index].id
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
        let postId = this.posts[index].id
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
        id: this.posts[index].id,
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
      let postId = this.posts[index].id
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
        id: this.posts[index].id,
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
          id: this.posts[index].id,
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
      let postId = this.posts[index].id
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
      let postId = this.posts[index].id
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
    },
    modalPostId (index, text) {
      return 'modalPost' + index + text
    },
    modalCommentId (index, indexComment, text) {
      return 'modalComment' + index + indexComment + text
    },
    modalLikeId (index, text) {
      return 'modalLike' + index + text
    }
  }
}
</script>

<style>
  .swal2-popup, .modal{
    font-family: 'Chewy';
  }
  .swal2-title{
    color: #2C3F5F;
  }
  a{
    display: flex;
    flex: 0 0 20%;
    justify-content: center;
  }
  .username{
    flex: 0 0 80%;
  }
  .carousel-control-prev-icon{
    background-image: url("../assets/img/previous.png");
    width: 30px;
    height: 30px;
  }
  .carousel-control-next-icon{
    background-image: url("../assets/img/next.png");
    width: 30px;
    height: 30px;
  }
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
    padding: 5% 5% 3% 5%;
  }
  .commentBtn{
    background-color: #2C3F5F;
    color: white;
    border-radius: 25px;
    display: flex;
    margin: 5% auto 5% auto;
  }
  .imgComment{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 6px black;
  }
  .userComment{
    justify-content: center;
    align-items: stretch;
    flex: 0 0 30%;
  }
  .commentsConfig{
    font-family: Chewy;
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    justify-content: space-between;
    align-items: stretch;
    text-align: center;
  }
  .comment{
    background-color: gainsboro;
    padding: 2%;
    margin: 0;
  }
  .commentText{
    box-sizing: border-box;
    word-break: break-word;
    flex: 0 0 65%;
  }
  #postInfo{
    align-items: baseline;
    justify-content: space-around;
  }
  #postPart{
    padding-bottom: 2%;
    border-bottom: 5px double #2C3F5F;
  }
  #postPart:last-child{
    border-bottom: none;
  }
  .imgPosts{
    margin: 5% auto;
    box-shadow: 0 0 10px #2C3F5F;
    border: 4px solid white;
  }
  .fa-flag{
    color: red;
    margin: 2%;
  }
  .fa-flag:hover{
    color: brown;
  }
  .fa-comments{
    color: darkcyan;
  }
  .fa-comments:hover{
    color: darkslategray;
  }
  .fa-thumbs-up{
    color: cornflowerblue;
  }
  #modifPost .fa-trash-alt{
    margin-top: 15%;
  }
  .fa-trash-alt{
    margin-top: 5%;
    color: red;
  }
  .fa-trash-alt, .fa-trash-alt span, .fa-edit, .fa-edit span{
    font-size: 14px;
    margin-bottom: 5%;
  }
  .fa-edit{
    margin-top: 5%;
    color: #2C3F5F;
  }
  i{
    font-size: 25px;
  }
  i span{
    font-family: Chewy;
    font-size: 25px;
    margin-left: 10%;
  }
  .fa-thumbs-up:hover{
    color: #0762a3;
  }
  h1{
    font-size: 25px;
  }
  label, input{
    margin-bottom: 5%;
  }
</style>
