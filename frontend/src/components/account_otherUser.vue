<template>
  <div class="col-lg-9 m-auto pb-2 pb-md-0 p-md-2" id="containerbg">
    <!--OTHER USER INFO-->
    <h1 class="titleConfig rounded-pill pt-3 pb-3">Compte utilisateur</h1>
    <section class="d-flex flex-column flex-md-row align-items-center justify-content-md-center ml-0 mr-0 mb-4 p-md-3" id="userPart">
      <img :src="infos.url_profile_picture" class="userPhoto" :alt="infos.alt_profile_picture">
      <div class="d-flex flex-column col-md-6 justify-content-around align-items-center">
        <h2>Vous êtes sur le profil de</h2>
        <h3>{{ infos.username }}</h3>
      </div>
    </section>

    <!--OTHER USER POSTS-->
    <section class="d-flex flex-column align-items-center p-0">
      <h2 class="titleConfig rounded-pill p-2 mb-2 mb-md-3 col-12">Ses publications</h2>

      <!--NO POST PUBLISHED-->
      <article v-if="userPosts.length === 0" class="d-flex flex-column mb-5 align-items-center justify-content-md-between col-md-10">
        <h3 class="m-auto pt-3">{{ infos.username }} n'a rien posté !</h3>
        <p class="m-auto mt-2">Retrouvez toutes les publications sur le <router-link to="/wall">mur principal !</router-link></p>
        <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts mt-2">
      </article>

      <!--ALL USER'S POSTS-->
      <article class="d-flex mb-5 container-fluid flex-column flex-md-row allPosts justify-content-center align-items-center" v-for="(post, index) in userPosts" :key="index">
        <div class="d-flex col-md-9 col-lg-8 justify-content-center m-auto align-items-center p-md-3 mt-2 mb-2 formPart">
          <div class="d-flex col-md-9 flex-column">

            <!--POST TITLE + CONTENT + GIF-->
            <h3>{{ post.title }}</h3>
            <p class="text-break">{{ post.content }}</p>
            <img :src="post.url_gif" v-if="post.url_gif" :alt="post.alt_gif" class="img-fluid imgPosts m-auto"/>
            <div class="d-flex row col-md-6 justify-content-around m-md-auto mr-auto ml-auto mb-3">

              <!--COMMENTS ICON-->
              <i v-if="!hasCommented(index)" v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="far fa-comments mt-2"><span>{{ post.Comments.length }}</span></i>
              <i v-else v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="fas fa-comments mt-2"><span>{{ post.Comments.length }}</span></i>

              <!--MODAL - GET COMMENTS-->
              <b-modal centered :id="'modalPost' + index + 'comments'" title="Commentaire(s) du post" @close="getUserPosts()" @ok="getUserPosts()" ok-only ok-title="Fermer" ok-variant="info">
                <div class="my-4 commentsConfig" v-for="(comment, indexComment) in comments" :key="comment.id">
                  <div class="d-flex justify-content-end flex-column" v-if="comment.PostId === userPosts[index].id">

                    <!--COMMENT AUTHOR + CONTENT-->
                    <div class="d-flex flex-md-row flex-column justify-content-sm-between align-items-center p-2 comment">
                      <div class="userComment align-items-center justify-content-center d-flex flex-column">
                        <!--LINK TO AUTHOR PROFILE-->
                        <router-link :to="`/profile/${comment.UserId}`"><img :src="comment.User.url_profile_picture" :alt="comment.User.alt_profile_picture" class="imgComment"/></router-link>
                        <h4>{{ comment.User.username}}</h4>
                      </div>
                      <div class="commentText text-break text-center col-md-8">{{ comment.comment }}</div>
                    </div>

                    <!--COMMENT OPTIONS-->
                    <i v-b-toggle="'optionsBtn'+index+indexComment" class="fas fa-cogs p-2 text-center"><span>Options du commentaire</span></i>
                    <b-collapse :id="'optionsBtn'+index+indexComment" class="border text-center pt-2">

                      <!--MODAL - REPORT COMMENT-->
                      <i class="far fa-flag m-auto p-2" v-b-modal="modalCommentId(index, indexComment, 'report')" @click="isClickedComment = true"><span> Signaler le commentaire</span></i>
                      <b-modal v-if="isClickedComment === true" centered :id="'modalComment' + index + indexComment + 'report'" title="Signaler le contenu du Commentaire" ok-only ok-title="Fermer" ok-variant="info" @close="getComments(index)" @ok="getComments(index)">
                        <b-form-group
                        class="d-flex flex-column col-12 mt-4 text-center"
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
                                  :state="stateCommentReport"
                          ></b-form-textarea>
                          <b-form-invalid-feedback>
                            Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                          </b-form-invalid-feedback>
                          <b-button type="submit" @click.prevent="sendCommentReport(index, indexComment)" class="commentBtn rounded-pill">Envoyer</b-button>
                        </b-form-group>
                      </b-modal>

                      <div class="d-flex flex-md-row flex-column text-center justify-content-md-center mt-2 mb-2" v-if="comment.User.id === currentUser.id || currentUser.infos.role && currentUser.infos.role.includes('admin')">

                        <!--MODAL - DELETE COMMENT-->
                        <i v-b-modal="modalCommentId(index, indexComment, 'delete')" class="fas fa-trash-alt col-md-4 mb-3 mb-md-0"><span>Supprimer le commentaire</span></i>
                        <b-modal centered ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalComment' + index + indexComment + 'delete'" title="Suppression du Commenntaire" @ok="deleteComment(index, indexComment), showAlertSuccess('Commentaire supprimé !')">
                          <div class="my-4">
                            Êtes vous sûr(e) de vouloir supprimer ce commentaire ?
                          </div>
                        </b-modal>

                        <!--MODAL - EDIT COMMENT-->
                        <i v-b-modal="modalCommentId(index, indexComment, 'update')" class="far fa-edit col-md-4" @click="setCommentValue(indexComment, index), isClicked = true"><span>Modifier le commentaire</span></i>
                        <b-modal centered v-if="isClicked === true" ok-only ok-title="Fermer" ok-variant="info" :id="'modalComment' + index + indexComment + 'update'" title="Modification du Commentaire">
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
                                        :state="stateComment"
                                >{{userComment.comment}}</b-form-textarea>
                                <b-form-invalid-feedback>
                                  Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                                </b-form-invalid-feedback>
                                <b-button v-b-modal.emojisComment5 class="mt-2 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                                <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment5" triggers="hover" placement="top">
                                  <div class="d-flex row m-2">
                                    <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                                  </div>
                                </b-modal>
                                <b-button type="submit" @click.prevent="updateComment(index, indexComment)" class="commentBtn rounded-pill">Modifier</b-button>
                              </b-form-group>
                            </b-form>
                          </div>
                        </b-modal>
                      </div>
                    </b-collapse>
                  </div>
                </div>
                <div>

                  <!--ADD COMMENT-->
                  <b-button type="button" class="btn commentBtn rounded-pill" @click="showTextArea()">Ajouter un commentaire</b-button>
                  <b-form-group
                  v-if="userComment.clicked"
                  label="Votre commentaire :"
                  label-for="userComment"
                  class="text-center">
                    <b-form-textarea
                      id="userComment"
                      required
                      v-model="userComment.comment"
                      placeholder="Entrez votre commentaire ..."
                      rows="3"
                      max-rows="6"
                      :state="stateComment"
                    ></b-form-textarea>
                    <b-form-invalid-feedback>
                      Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                    </b-form-invalid-feedback>
                    <b-button v-b-modal.emojisComment6 class="mt-2 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                    <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment6" triggers="hover" placement="top">
                      <div class="d-flex row m-2">
                        <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                      </div>
                    </b-modal>
                    <b-button type="submit" @click.prevent="addComment(index)" class="commentBtn rounded-pill">Commenter</b-button>
                  </b-form-group>
                </div>
              </b-modal>

              <!--LIKES ICON-->
              <i v-if="!hasAlreadyLiked(index)" v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="far fa-thumbs-up mt-2"><span>{{ post.Likes.length }}</span></i>
              <i v-else v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="fas fa-thumbs-up mt-2"><span>{{ post.Likes.length }}</span></i>

              <!--MODAL - GET LIKES-->
              <b-modal centered ok-only ok-title="Fermer" ok-variant="warning" :id="'modalLike' + index + 'like'" title="Like(s) du post" @ok="getUserPosts()" @close="getUserPosts()">
                <div class="my-4 d-flex p-2 flex-column flex-md-row align-items-center justify-content-center" v-for="like in likes" :key="like.id" id="like">
                  <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="imgComment"/></router-link>
                  <h4 class="d-flex col-9 justify-content-center justify-content-md-start">{{ like.username }}</h4>
                </div>
                <!--CHANGING BUTTON LIKE/DISLIKE-->
                <b-btn pill class="d-flex m-auto" :variant="btnLikeVariant" @click="createLike(index), showAlertSuccess()">{{ btnLike }}</b-btn>
              </b-modal>
            </div>
          </div>
        </div>
        <div class="col-md-2 col-lg-3">

          <!--POST OPTIONS-->
          <i v-b-toggle="'optionsBtn'+index" class="fas fa-cogs p-2 text-center"><span>Options du post</span></i>
          <b-collapse :id="'optionsBtn'+index" class="text-center pt-2">
            <div class="d-flex flex-column align-items-center justify-content-center">

              <!--MODAL - REPORT POST-->
              <i class="far fa-flag d-flex" id="reportIcon" v-b-modal="modalPostId(index, 'report')" @click="isClicked = true"><span>Signaler le post</span></i>
              <b-modal centered v-if="isClicked === true" ok-only ok-title="Fermer" ok-variant="info" :id="'modalPost' + index + 'report'" title="Signaler le contenu du Post" @close="getUserPosts" @cancel="getUserPosts" @ok="getUserPosts">
                <b-form-group
                        class="d-flex flex-column text-center col-12 mt-4"
                        label="Signalement :"
                        label-for="postReport">
                  <b-form-textarea
                          id="postReport"
                          placeholder="Expliquez nous le problème que vous rencontrez avec ce post ..."
                          v-model="postReport"
                          class="postInput"
                          required
                          rows="3"
                          max-rows="6"
                          :state="statePostReport"
                  ></b-form-textarea>
                  <b-form-invalid-feedback>
                    Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                  </b-form-invalid-feedback>
                  <b-button type="submit" @click.prevent="sendPostReport(index)" class="commentBtn rounded-pill">Envoyer</b-button>
                </b-form-group>
              </b-modal>

              <!--IF CURRENT USER IS ADMIN-->
              <div v-if="currentUser.infos.role && currentUser.infos.role.includes('admin')" class="d-flex flex-column">

                <!--MODAL - DELETE POST-->
                <i v-b-modal="modalPostId(index, 'delete')" class="fas fa-trash-alt mt-2 mb-3"><span>Supprimer le post</span></i>
                <b-modal ok-title="Supprimer" centered ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalPost' + index + 'delete'" title="Suppression du Post" @ok="deletePost(index), showAlertSuccess('Post supprimé !')">
                  <div class="my-4">
                    Êtes vous sûr(e) de vouloir supprimer ce post ?
                  </div>
                </b-modal>

                <!--MODAL - EDIT POST-->
                <i v-b-modal="modalPostId(index, 'update')" class="far fa-edit mb-4 mb-md-0" @click="setPostValue(index), isClicked = true"><span>Modifier le post</span></i>
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
                                class="postInput"
                                :state="statePostTitle"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                              label="Contenu du post :"
                              label-for="contentUpdate"
                              class="text-center">
                        <b-form-textarea
                                id="contentUpdate"
                                v-model="userPost.content"
                                required
                                class="postInput mb-3"
                                rows="3"
                                max-rows="6"
                                :state="statePostContent"
                        >{{ userPost.content }}</b-form-textarea>
                        <b-form-invalid-feedback>
                          Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                        </b-form-invalid-feedback>
                        <b-button v-b-modal.emojis3 class="mt-1 mb-3 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                        <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojis3" triggers="hover" placement="top">
                          <div class="d-flex row m-2">
                            <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
                          </div>
                        </b-modal>
                        <div id="postUpdate">
                          <!--PREVIEW NEW GIF-->
                          <img :src="userPost.img" v-if="url.length === 0" class="img-fluid imgPosts d-flex m-auto" id="updateImg" :alt="userPost.altImg"/>
                          <img v-else :src="url" class="img-fluid mr-auto ml-auto imgPosts d-flex" alt="Preview new image">
                          <b-form-group
                          label="Votre Gif :"
                          label-for="fileInput"
                          description="Fichiers acceptés : 'jpg', 'jpeg', 'png', 'gif'"
                          class="mt-3">
                            <b-form-file id="fileInput" v-model="file" accept=".jpg, .png, .gif, .jpeg" @change="onFileChanged"></b-form-file>
                          </b-form-group>
                        </div>
                        <b-button type="submit" @click.prevent="updatePost(index)" class="d-flex mt-3 rounded-pill commentBtn">Modifier</b-button>
                      </b-form-group>
                    </b-form>
                  </div>
                </b-modal>
              </div>
            </div>
          </b-collapse>
        </div>
      </article>
    </section>

    <!--ADMIN PANEL IF CURRENT USER IS ADMIN-->
    <section v-if="currentUser.infos.role && currentUser.infos.role.includes('admin')" class="d-flex flex-column align-items-center mb-5">
      <h2 class="titleConfig rounded-pill p-2 mb-5 col-12">Options pour {{ infos.username }}</h2>
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-between col-md-12">
        <div class="d-flex flex-column mb-3 col-md-4">

          <!--UPDATE USER ROLE-->
          <h3>Privilège(s) de {{ infos.username }}</h3>
          <p>Actuellement {{ infos.username }} dispose des droits suivants : <span>{{ userRole.toUpperCase() }}</span></p>
          <b-button class="rounded-pill mb-3 mb-md-0" variant="info" @click="updatePrivilege()">Modifier les privilèges</b-button>
        </div>

        <!--CONTACT USER-->
        <b-button class="rounded-pill mb-3 mb-md-0 col-md-3" variant="warning" :href="'mailto:' + infos.email">Envoyer un mail à {{ infos.username }}</b-button>

        <!--MODAL - DELETE USER ACCOUNT-->
        <b-button class="rounded-pill mb-5 mb-md-0 col-md-3" variant="danger" v-b-modal.deleteUser>Supprimer {{ infos.username }}</b-button>
        <b-modal centered ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" id="deleteUser" :title="'Suppression du compte de ' + infos.username" @ok="deleteUser()">
          <div class="my-4">
            Êtes vous sûr(e) de vouloir supprimer le compte de {{ infos.username }} ?
          </div>
        </b-modal>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'accountOtherUser',
  data () {
    return {
      infos: {},
      posts: {},
      likes: '',
      emojis: this.$store.state.posts.emojis,
      showModal: false,
      btnLike: '',
      btnLikeVariant: '',
      userPost: {
        title: '',
        content: '',
        img: '',
        altImg: ''
      },
      userComment: {
        comment: '',
        clicked: false
      },
      commentReport: '',
      postReport: '',
      userRole: '',
      isClicked: false,
      isClickedComment: false,
      url: '',
      file: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.currentUser
    },
    userPosts () {
      return this.$store.state.posts.allPostsFromUser
    },
    comments () {
      return this.$store.state.posts.allComments
    },

    //FORM VALIDATION
    statePostTitle () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.userPost.title.length > 0 && !regex.test(this.userPost.title)){
        return true
      } else if(this.userPost.title.length > 0 && regex.test(this.userPost.title) || regex.test(this.userPost.title)) {
        return false
      } else {
        return null
      }
    },
    statePostContent () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.userPost.content.length > 0 && !regex.test(this.userPost.content)){
        return true
      } else if(this.userPost.content.length > 0 && regex.test(this.userPost.content) || regex.test(this.userPost.content)) {
        return false
      } else {
        return null
      }
    },
    statePostReport () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.postReport.length > 0 && !regex.test(this.postReport)){
        return true
      } else if(this.postReport.length > 0 && regex.test(this.postReport) || regex.test(this.postReport)) {
        return false
      } else {
        return null
      }
    },
    stateComment () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.userComment.comment.length > 0 && !regex.test(this.userComment.comment)){
        return true
      } else if(this.userComment.comment.length > 0 && regex.test(this.userComment.comment) || regex.test(this.userComment.comment)) {
        return false
      } else {
        return null
      }
    },
    stateCommentReport () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.commentReport.length > 0 && !regex.test(this.commentReport)){
        return true
      } else if(this.commentReport.length > 0 && regex.test(this.commentReport) || regex.test(this.commentReport)) {
        return false
      } else {
        return null
      }
    }
  },
  methods: {
    //USER OPTIONS WHEN CURRENT USER IS ADMIN
    deleteUser () {
      if(this.$route.params.id == 2){
        this.showAlertError(`Vous ne pouvez pas supprimer ce compte par défaut`, '2500')
      } else {
        this.$store.dispatch('user/deleteUser', this.$route.params.id)
                .then(() => {
                  this.showAlertSuccess('Utilisateur Supprimé')
                  this.$router.push({name: 'wall'})
                })
      }
    },
    updatePrivilege () {
      let id = this.infos.id
      this.$store.dispatch('user/updatePrivilege', id)
        .then(() => {
          this.$store.dispatch('user/getOneUser', this.$route.params.id)
            .then((response) => {
              this.showAlertSuccess(`Les privilèges de ${response.data.username} ont été modifiés : ${JSON.parse(response.data.role).join(', ')}!`, '2500')
              this.infos = response.data
              this.userRole = JSON.parse(response.data.role).join(', ')
            })
        })
    },

    //POSTS OPTIONS WHEN CURRENT USER IS ADMIN
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
    setPostValue (index) {
      let postId = this.userPosts[index].id
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
    onFileChanged (e) {
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      const file = e.target.files[0]
      if (!authorizedFile.includes(file.name.split('.')[1])) {
        this.url = 'http://localhost:3000/images/wrongExtension.png'
      } else {
        this.url = URL.createObjectURL(file)
      }
    },
    updatePost (index) {
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      if(this.statePostTitle !== true || this.statePostContent !== true || !authorizedFile.includes(this.file.name.split('.')[1])){
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        this.showAlertSuccess('Post modifié !')
        let postId = this.userPosts[index].id
        let formData = new FormData()
        formData.append('title', this.userPost.title.toString())
        formData.append('content', this.userPost.content.toString())
        formData.append('image', this.file)
        let payload = {
          id: postId,
          data: formData
        }
        this.isClicked = false
        this.$store.dispatch('posts/updatePost', payload)
                .then(() => {
                  this.file = null
                  this.userPost.title = ''
                  this.userPost.content = ''
                  this.getUserPosts()
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
      }
    },
    deletePost (index) {
      let postId = this.userPosts[index].id
      this.$store.dispatch('posts/deletePost', postId)
              .then(() => {
                this.getUserPosts()
              })
              .catch(error => {
                if (error.message.split('code ')[1].includes('500')) {
                  this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
                } else if (error.message.split('code ')[1].includes('401')) {
                  this.showAlertError(`Vous n'avez pas le droit de supprimer ce post, si besoin, vous pouvez signaler le contenu du post en cliquant sur le drapeau rouge !`, '4000')
                }
              })
    },

    //POSTS
    getUserPosts () {
      this.$store.dispatch('posts/getAllPostsFromOneUser', this.$route.params.id)
    },
    sendPostReport (index) {
      if (this.postReport.length === 0 || this.statePostReport !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let payload = {
          id: this.userPosts[index].id,
          newReport: {
            report: this.postReport.toString()
          }
        }
        this.showAlertSuccess('Post signalé !')
        this.isClicked = false
        this.$store.dispatch('posts/sendPostReport', payload)
          .then(() => {
            this.postReport = ''
          }).catch(error => {
            if (error.message.split('code ')[1].includes('500')) {
              this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
            } else if (error.message.split('code ')[1].includes('400')) {
              this.showAlertError(`Nous n'avons pas pu vous identifier, merci de vous connecter ou de créer un compte !`, '3500')
            }
          })
      }
    },

    //COMMENTS
    getComments (index) {
      console.log(this.posts)
      let postId = this.userPosts[index].id
      this.$store.dispatch('posts/getComments', postId)
        .catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    showTextArea () {
      this.userComment.clicked = true
    },
    hasCommented (index) {
      if (this.userPosts[index].Comments.filter(comment => comment.user_id === this.currentUser.id).length !== 0) {
        return true
      }
    },
    addComment (index) {
      if (this.userComment.comment.length === 0 || this.stateComment !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let postId = this.userPosts[index].id
        let payload = {
          id: postId,
          newComment: {
            comment: null
          }
        }
        payload.newComment.comment = this.userComment.comment.toString()
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
    setCommentValue (indexComment, index) {
      let payload = {
        id: this.userPosts[index].id,
        commentId: this.comments[indexComment].id
      }
      this.$store.dispatch('posts/getOneComment', payload)
        .then(comment => {
          this.userComment.comment = comment.data.comment
        }).catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    updateComment (index, indexComment) {
      if (this.userComment.comment.length === 0 || this.stateComment !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        this.showAlertSuccess('Commentaire modifié !')
        let postId = this.userPosts[index].id
        let payload = {
          id: postId,
          commentId: this.comments[indexComment].id,
          newComment: {
            comment: this.userComment.comment.toString()
          }
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
      }
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
      if (this.commentReport.length === 0 || this.stateCommentReport !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let payload = {
          id: this.userPosts[index].id,
          commentId: this.comments[indexComment].id,
          newReport: {
            report: this.commentReport.toString()
          }
        }
        this.showAlertSuccess('Commentaire signalé !')
        this.$store.dispatch('posts/sendCommentReport', payload)
          .then(() => {
            this.commentReport = ''
            this.isClickedComment = false
          }).catch(() => {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          })
      }
    },

    //LIKES
    hasAlreadyLiked (index) {
      if (this.userPosts[index].Likes.filter(like => like.user_id === this.currentUser.id).length !== 0) {
        return true
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
    },

    //MODALS AND ALERTS
    showAlertError (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: timer})
    },
    showAlertSuccess (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
        icon: 'success',
        showConfirmButton: false,
        timer: timer || '1500'})
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
  },
  beforeMount () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('user/getCurrentUser')
        .then((user) => {
          if(this.$route.params.id == 2 && !user.data.role.includes('admin')){
            this.$router.push({name: 'wall'})
            this.showAlertError('Vous ne disposez pas des droits nécessaires pour accéder à ce profil', '2500')
          } else {
            this.$store.dispatch('user/getOneUser', this.$route.params.id)
                    .then(response => {
                      this.infos = response.data
                      this.userRole = JSON.parse(response.data.role).join(', ')
                      this.$store.dispatch('posts/getAllPostsFromOneUser', this.infos.id)
                              .then(posts => {
                                this.posts = posts.data
                              })
                    })
          }
        })
    }
  }
}
</script>

<style scoped>
  h1{
    font-size: 35px;
  }
  h2{
    font-size: 25px;
  }
  h3{
    font-size: 22px;
  }
  a:hover{
    text-decoration: none;
  }
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  i{
    font-size: 1.2em;
  }
  i span{
    font-size: 0.8em;
  }
  .fa-flag:hover, .fa-trash-alt:hover{
    color: brown;
  }
  .fa-comments:hover{
    color: darkslategray;
  }
  .fa-thumbs-up:hover{
    color: #2C3F5F;
  }
  .fa-edit:hover{
    color: #0762a3;
  }
  #userPart{
    background-image: url("../assets/img/bgUser.png");
    background-size: cover;
    border-radius: 25px;
  }
  .commentBtn{
    background-color: #2C3F5F;
    color: white;
    display: flex;
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
