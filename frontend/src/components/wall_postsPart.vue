<template>
  <div class="d-flex flex-column m-lg-auto">
    <!--NO POST-->
    <div v-if="posts.length === 0" class="col-md-8 m-auto">
      <h3 class="mt-3">Aucun post n'a encore été publié ! Lancez vous !</h3>
      <p>Si vous ne savez pas comment faire, regardez le tutoriel dans le carrousel en haut de page ou retrouvez nos astuces dans la section FAQ !!</p>
      <img src="../assets/img/hello.gif" alt="hello gif" class="m-auto img-fluid imgPosts">
    </div>

    <!--ALL POSTS-->
    <div id="postPart" class="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-around mt-4 pb-4" v-for="(post, index) in posts" :key="post.id">
      <div class="d-flex col-md-2 justify-content-center align-items-center flex-column">

        <!--POST AUTHOR-->
        <div class="d-flex flex-column mb-3 mb-md-0">
          <h3>{{ post.User.username }}</h3>
          <router-link :to="`/profile/${post.UserId}`"><img :src="post.User.url_profile_picture" :alt="post.User.alt_profile_picture" class="userPhoto"/></router-link>
        </div>

        <!--ADMIN PANEL IF USER IS ADMIN OR USER IS AUTHOR-->
        <i v-b-toggle="settings(index)" v-if="post.User.id === currentUser.id || currentUser.infos.role && currentUser.infos.role.includes('admin')" class="fas fa-cogs d-flex align-items-center mt-md-2 mb-3 mb-md-1"><span>Options du Post</span></i>
        <b-collapse :id="'settings' + index" class="flex-column justify-content-center">
          <!--MODAL - DELETE POST-->
          <i v-b-modal="modalPostId(index, 'delete')" class="fas fa-trash-alt mb-2 mt-3"><span>Supprimer le post</span></i>
          <b-modal centered ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalPost' + index + 'delete'" title="Suppression du Post" @ok="deletePost(index), showAlertSuccess('Post supprimé !')">
            <div class="my-4">
              Êtes vous sûr(e) de vouloir supprimer ce post ?
            </div>
          </b-modal>

          <!--MODAL - UPDATE POST-->
          <i v-b-modal="modalPostId(index, 'update')" class="far fa-edit mt-2 mb-2" @click="setPostValue(index), isClicked = true"><span>Modifier le post</span></i>
          <b-modal centered v-if="isClicked === true" ok-only ok-title="Fermer" ok-variant="info" :id="'modalPost' + index + 'update'" title="Modification du Post" @close="url = ''" @ok="url = ''">
            <div class="my-4">
              <b-form enctype="multipart/form-data">
                <b-form-group
                label="Titre du post :"
                label-for="titleUpdate"
                class="text-center">
                  <b-form-input
                    id="titleUpdate"
                    v-model="userPost.title"
                    value="userPost.title"
                    required
                    class="postInput mb-3"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                label="Contenu du post :"
                label-for="contentUpdate"
                class="text-center">
                  <b-form-textarea
                    id="contentUpdate"
                    v-model="userPost.content"
                    required
                    class="postInput"
                    rows="3"
                    max-rows="6"
                  >{{ userPost.content }}</b-form-textarea>
                </b-form-group>
                <b-button v-b-modal.emojis2 class="d-flex mr-auto ml-auto mt-2 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojis2" triggers="hover" placement="top">
                  <div class="d-flex row m-2">
                    <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
                  </div>
                </b-modal>
                <div id="postUpdate" class="mt-3">
                  <img :src="userPost.img" v-if="url.length === 0" class="img-fluid imgPosts m-auto d-flex" id="updateImg" :alt="userPost.altImg"/>
                  <img v-else :src="url" class="img-fluid imgPosts d-flex" alt="Preview new image">
                  <b-form-file v-model="file" class="mt-3" @change="onFileChanged"></b-form-file>
                </div>
                <b-button type="submit" @click.prevent="updatePost(index), showAlertSuccess('Post modifié !')" class="rounded-pill d-flex commentBtn">Modifier</b-button>
              </b-form>
            </div>
          </b-modal>
        </b-collapse>
      </div>

      <!--POST CONTENT-->
      <div class="d-flex formPart flex-column col-md-8 p-3 m-md-4">
        <h4>{{ post.title }}</h4>
        <p v-html="getLinks(post.content)" class="text-break"></p>
        <img :src="post.url_gif" :alt="post.alt_gif" class="img-fluid m-auto imgPosts"/>
        <div class="d-flex row justify-content-around mt-3">

          <!--USER PANEL-->
          <div class="align-baseline justify-content-around" id="userPanel">
            <!--MODAL - REPORT POST-->
            <i class="far fa-flag" v-b-modal="modalPostId(index, 'report')" @click="isClicked = true"></i>
            <b-modal v-if="isClicked === true" centered :id="'modalPost' + index + 'report'" title="Signaler le contenu du Post" ok-only ok-title="Fermer" ok-variant="info" @close="getPosts" @cancel="getPosts" @ok="getPosts">
              <b-form-group
              label="Signalement :"
              label-for="postReport"
              class="d-flex flex-column col-12 mt-4 p-0 text-center">
                <b-form-textarea
                  id="postReport"
                  placeholder="Expliquez nous le problème que vous rencontrez avec ce post ..."
                  v-model="postReport"
                  class="postInput mt-2"
                  required
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
              <b-button type="submit" @click.prevent="sendPostReport(index)" class="rounded-pill d-flex commentBtn">Envoyer</b-button>
            </b-modal>
          </div>
          <div>

            <!--COMMENTS ICON-->
            <i v-if="!hasCommented(index)" v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="far fa-comments"><span>{{ post.Comments.length }}</span></i>
            <i v-else v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="fas fa-comments"><span>{{ post.Comments.length }}</span></i>

            <!--MODAL - GET COMMENTS-->
            <b-modal centered :id="'modalPost' + index + 'comments'" ok-only ok-variant="info" ok-title="Fermer" title="Commentaire(s) du post" @close="getPosts(), userComment.clicked = null" @cancel="getPosts(), userComment.clicked = null" @ok="getPosts(), userComment.clicked = null">
              <div class="my-4 commentsConfig justify-content-between text-center align-items-lg-stretch" v-for="(comment, indexComment) in comments" :key="comment.id">
                <div class="d-flex justify-content-end flex-column">

                  <!--COMMENTS AUTHOR + CONTENT-->
                  <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center p-2 m-0 comment">
                    <div class="align-items-lg-stretch justify-content-center d-flex flex-column col-md-3">
                      <!--LINK TO COMMENT AUTHOR PROFILE-->
                      <router-link :to="`/profile/${comment.UserId}`"><img :src="comment.User.url_profile_picture" :alt="comment.User.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                      <h4>{{ comment.User.username}}</h4>
                    </div>
                    <div class="text-break col-md-9">{{ comment.comment }}</div>
                  </div>

                  <!--COMMENTS OPTIONS-->
                  <i v-b-toggle="'optionsBtn'+index+indexComment" class="fas fa-cogs p-2"><span>Options du commentaire</span></i>
                  <b-collapse :id="'optionsBtn'+index+indexComment" class="border pt-2">

                    <!--MODAL - COMMENT REPORT-->
                    <i class="far fa-flag" v-b-modal="modalCommentId(index, indexComment, 'report')" @click="isCommentReportClicked = true"><span>Signaler le commentaire</span></i>
                    <b-modal centered v-if="isCommentReportClicked === true" :id="'modalComment' + index + indexComment + 'report'" ok-only ok-title="Fermer" ok-variant="info" title="Signaler le contenu du Commentaire" @close="getComments(index)" @cancel="getComments(index)" @ok="getComments(index)">
                      <b-form-group
                      class="d-flex flex-column text-center col-12 mt-4 p-0"
                      label="Signalement :"
                      label-for="commentReport">
                        <b-form-textarea
                                id="commentReport"
                                placeholder="Expliquez nous le problème que vous rencontrez avec ce commentaire ..."
                                v-model="commentReport"
                                class="postInput"
                                required
                                rows="3"
                                max-rows="6"
                        ></b-form-textarea>
                        <b-button type="submit" @click.prevent="sendCommentReport(index, indexComment)" class="rounded-pill d-flex commentBtn">Envoyer</b-button>
                      </b-form-group>
                    </b-modal>

                    <!--MODAL - DELETE COMMENT - IF USER IS COMMENT AUTHOR OR USER IS ADMIN-->
                    <i v-b-modal="modalCommentId(index, indexComment, 'delete')" v-if="comment.User.id === currentUser.id || currentUser.infos.role && currentUser.infos.role.includes('admin')" class="fas fa-trash-alt mb-2 mt-2"><span>Supprimer le commentaire</span></i>
                    <b-modal ok-title="Supprimer" centered ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalComment' + index + indexComment + 'delete'" title="Suppression du Commenntaire" @ok="deleteComment(index, indexComment), showAlertSuccess('Commentaire supprimé !')">
                      <div class="my-4">
                        Êtes vous sûr(e) de vouloir supprimer ce commentaire ?
                      </div>
                    </b-modal>

                    <!--MODAL - UPDATE COMMENT - IF USER IS COMMENT AUTHOR OR USER IS ADMIN-->
                    <i v-b-modal="modalCommentId(index, indexComment, 'update')" class="far fa-edit mt-2 mb-2" v-if="comment.User.id === currentUser.id || currentUser.infos.role && currentUser.infos.role.includes('admin')" @click="setCommentValue(indexComment, index), isClicked = true"><span>Modifier le commentaire</span></i>
                    <b-modal v-if="isClicked === true" centered ok-only ok-title="Fermer" ok-variant="info" :id="'modalComment' + index + indexComment + 'update'" title="Modification du Commentaire">
                      <div class="my-4">
                        <b-form enctype="multipart/form-data">
                          <b-form-group
                          label="Contenu du commentaire :"
                          label-for="commentUpdate"
                          class="text-center">
                            <b-form-textarea
                                    id="commentUpdate"
                                    required
                                    v-model="userComment.comment"
                                    class="postInput text-center"
                                    rows="6"
                                    max-rows="12"
                            >{{userComment.comment}}</b-form-textarea>
                            <b-button v-b-modal.emojisComment2 class="mt-2 rounded-pill d-flex mr-auto ml-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                            <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment2" triggers="hover" placement="top">
                              <div class="d-flex row m-2">
                                <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                              </div>
                            </b-modal>
                            <b-button type="submit" @click.prevent="updateComment(index, indexComment), showAlertSuccess('Commentaire modifié !')" class="d-flex commentBtn rounded-pill">Modifier</b-button>
                          </b-form-group>
                        </b-form>
                      </div>
                    </b-modal>
                  </b-collapse>
                </div>
              </div>

              <!--ADD COMMENT-->
              <div>
                <b-button type="button" class="d-flex rounded-pill commentBtn" @click="showTextArea()">Ajouter un commentaire</b-button>
                <b-form-group v-if="userComment.clicked"
                label="Votre commentaire :"
                label-for="userComment"
                class="text-center">
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
                  <b-button v-b-modal.emojisComment class="mt-2 rounded-pill d-flex mr-auto ml-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                  <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment" triggers="hover" placement="top">
                    <div class="d-flex row m-2">
                      <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                    </div>
                  </b-modal>
                  <b-button type="submit" @click.prevent="addComment(index)" class="rounded-pill commentBtn d-flex">Commenter</b-button>
                </b-form-group>
              </div>
            </b-modal>
          </div>

          <!--LIKES-->
          <div>
            <!--LIKES ICON-->
            <i v-if="!hasAlreadyLiked(index)" v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>
            <i v-else v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="fas fa-thumbs-up"><span>{{ post.Likes.length }}</span></i>

            <!--MODAL - GET LIKES-->
            <b-modal ok-only ok-title="Fermer" centered ok-variant="warning" :id="'modalLike' + index + 'like'" title="Like(s) du post" @ok="getPosts(index)" @close="getPosts(index)">
              <div class="my-4 d-flex row justify-content-center align-items-center" v-for="like in likes" :key="like.id" id="like">
                <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                <h4 class="d-flex username col-9">{{ like.username }}</h4>
              </div>
              <!--CHANGING BUTTON LIKE/DISLIKE-->
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
      emojis: this.$store.state.posts.emojis,
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
      postReport: null,
      isClicked: false,
      optionClicked: false,
      isCommentReportClicked: false
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
    getEmoji (index) {
      let emojiCode = this.emojis[index]
      if(this.userPost.content === null) {
        this.userPost.content = emojiCode
      } else {
        this.userPost.content += emojiCode
      }
      this.$swal({
        title: '',
        timer: '1000',
        text: '✔ Ajouté !️',
        showConfirmButton: false
      })
    },
    getEmojiComment (index) {
      let emojiCode = this.emojis[index]
      if(this.userComment.comment === null) {
        this.userComment.comment = emojiCode
      } else {
        this.userComment.comment += emojiCode
      }
      this.$swal({
        title: '',
        timer: '1000',
        text: '✔ Ajouté !️',
        showConfirmButton: false
      })
    },
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
        position: 'center',
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
      this.isClicked = false
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
          if(this.currentUser.infos.role.includes('admin')){
            this.$store.dispatch('messageWaiting')
          }
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
        this.isClicked = false
        this.showAlertSuccess('Post signalé !')
        this.$store.dispatch('posts/sendPostReport', payload)
          .then(() => {
            this.postReport = null
            if(this.currentUser.infos.role.includes('admin')){
              this.$store.dispatch('messageWaiting')
            }
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
      this.isClicked = false
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
          if(this.currentUser.infos.role.includes('admin')){
            this.$store.dispatch('messageWaiting')
          }
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
        this.isCommentReportClicked = false
        this.showAlertSuccess('Commentaire signalé !')
        this.$store.dispatch('posts/sendCommentReport', payload)
          .then(() => {
            this.commentReport = null
            if(this.currentUser.infos.role.includes('admin')){
              this.$store.dispatch('messageWaiting')
            }
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
    },
    settings (index) {
      return 'settings' + index
    }
  }
}
</script>

<style>
  a{
    display: flex;
    flex: 0 0 20%;
    justify-content: center;
  }
  .username{
    flex: 0 0 80%;
  }
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
  .commentBtn{
    background-color: #2C3F5F !important;
    color: white;
    margin: 5% auto;
  }
  .commentBtn:hover{
    background-color: #0762a3 !important;
  }
  .imgComment{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 6px black;
  }
  .commentsConfig{
    font-family: Chewy;
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
  }
  .comment{
    background-color: gainsboro;
  }
  #postPart{
    border-bottom: 5px double #2C3F5F;
  }
  #postPart:last-child{
    border-bottom: none;
  }
  .imgPosts{
    box-shadow: 0 0 10px #2C3F5F;
    border: 4px solid white;
  }
  .fa-flag{
    color: red;
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
  .fa-trash-alt{
    color: red;
  }
  .fa-edit{
    color: #2C3F5F;
  }
  i, i span{
    font-family: Chewy;
    font-size: 1.1em;
  }
  i span{
    margin-left: 5%;
    font-weight: normal;
  }
  .fa-thumbs-up:hover{
    color: #0762a3;
  }
  h1{
    font-size: 25px;
  }
  h3, h4{
    font-size: 20px;
  }
  label, input{
    margin-bottom: 5%;
  }
  .swal2-popup, .modal, .swal2-shown, .popover-header, .popover-body{
    font-family: 'Chewy';
  }
  .swal2-title{
    color: #2C3F5F;
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
</style>
