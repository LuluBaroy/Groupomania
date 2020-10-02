<template>
  <div class="col-lg-9 m-auto flex-column pt-4 pl-1 pr-1 p-3" id="containerbg">
    <h1 class="titleConfig rounded-pill p-2 mb-4">Votre compte</h1>

    <!--USER INFO'S PART-->
    <section class="container-fluid d-flex flex-column align-items-center p-0 p-lg-3" id="userPart">
      <div class="d-flex row m-auto justify-content-around align-items-center">
        <div class="d-flex flex-column align-items-center">
          <img :src="currentUser.infos.url_profile_picture" class="userPhoto mt-4 mb-4 mb-md-5">

          <!--MODAL - EDIT INFO-->
          <i class="far fa-edit mb-4 mb-md-0" v-b-modal.updateProfile><span>Editer les informations</span></i>
          <b-modal centered ok-title="Modifier" ok-variant="info" cancel-title="Annuler" cancel-variant="warning" id="updateProfile" title="Editer vos informations" @ok="updateUser">
            <div class="my-4">
              <b-form-group
                id="fieldset-1"
                label="Email : "
                label-for="input-1"
              >
                <b-form-input id="input-1" v-model="userInfo.email"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-2"
                label="Mot de passe : "
                label-for="input-2"
              >
                <b-form-input id="input-2" v-model="userInfo.newPassword"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-3"
                label="Nom d'utilisateur : "
                label-for="input-3"
              >
                <b-form-input id="input-3" v-model="userInfo.username"></b-form-input>
              </b-form-group>
              <b-form-group
                id="fieldset-4"
                label="Bio : "
                label-for="input-4"
              >
                <b-form-textarea id="input-4" rows="2" max-rows="4" placeholder="Partagez quelques informations à propos de vous..." v-model="userInfo.bio">{{ userInfo.bio }}</b-form-textarea>
              </b-form-group>
              <b-form-file
                v-model="file"
                label="Image du profil : "
                placeholder="Choisissez une nouvelle image de profil ..."
              ></b-form-file>
            </div>
          </b-modal>
        </div>

        <!--USER INFO-->
        <div id="userInfos" class="col-md-6 mb-3 mb-md-0 m-md-2 text-break">
          <h2 class="mb-2 mb-md-5">Vos informations</h2>
          <div class="d-flex flex-column flex-md-row mt-2 border-bottom">
            <p class="mr-md-4 infoTitle">Email : </p>
            <p>{{ currentUser.infos.email }}</p>
          </div>
          <div class="d-flex flex-column flex-md-row mt-2 border-bottom">
            <p class="mr-md-4 infoTitle">Mot de passe (ici masqué) : </p>
            <p>{{ currentUser.infos.password }}</p>
          </div>
          <div class="d-flex flex-column flex-md-row mt-2 border-bottom">
            <p class="mr-md-4 infoTitle">Nom d'utilisateur : </p>
            <p>{{ currentUser.infos.username }}</p>
          </div>
          <div class="d-flex flex-column flex-md-row mt-2" v-if="currentUser.infos.bio !== ''">
            <p class="mr-4 infoTitle">Bio : </p>
            <p>{{ currentUser.infos.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!--USER'S POSTS-->
    <section class="d-flex flex-column align-items-center container p-0 mt-4">
      <h2 class="rounded-pill p-2 p-lg-3 titleConfig mb-4 col-12">Vos publications</h2>

      <!--NO POST PUBLISHED-->
      <div v-if="userPosts.length === 0" class="d-flex flex-column align-items-center justify-content-md-between allPosts">
        <h3 class="pt-md-3">Vous n'avez rien posté pour le moment, Lancez-vous !</h3>
        <p>Si vous ne savez pas comment faire, regardez le tutoriel dans le carrousel sur le <router-link to="/wall">mur principal</router-link> ou retrouvez nos astuces dans la section FAQ !!</p>
        <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts mt-2 mb-5">
      </div>

      <!--ALL USER'S POSTS-->
      <div class="d-flex flex-column p-0 container-fluid flex-md-row align-items-center mb-md-3 pb-md-3 justify-content-md-between allPosts" v-for="(post, index) in userPosts" :key="index">
        <div class="d-flex col-md-9 col-lg-8 mr-lg-auto ml-lg-auto justify-content-center align-items-center formPart">

          <!--POST TITLE + CONTENT + GIF-->
          <div class="d-flex col-md-9 flex-column">
            <h3>{{ post.title }}</h3>
            <p v-html="getLinks(post.content)"></p>
            <img :src="post.url_gif" v-if="post.url_gif" :alt="post.alt_gif" class="img-fluid m-auto imgPosts"/>
            <div class="d-flex flex-md-row m-auto col-md-6 justify-content-around p-2">

              <!--COMMENTS ICON-->
              <i v-if="!hasCommented(index)" v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="far fa-comments mt-2"><span>{{ post.Comments.length }}</span></i>
              <i v-else v-b-modal="modalPostId(index, 'comments')" @click="getComments(index)" class="fas fa-comments mt-2"><span>{{ post.Comments.length }}</span></i>

              <!--MODAL - GET COMMENTS-->
              <b-modal centered ok-only ok-variant="info" ok-title="Fermer" :id="'modalPost' + index + 'comments'" title="Commentaire(s) du post" @close="getUserPosts()" @cancel="getUserPosts()" @ok="getUserPosts()">
                <div class="my-4 commentsConfig" v-for="(comment, indexComment) in comments" :key="comment.id">
                  <div class="d-flex flex-column" v-if="comment.PostId === userPosts[index].id">

                    <!--COMMENT AUTHOR + CONTENT-->
                    <div class="d-flex flex-column flex-md-row justify-content-sm-between align-items-center comment">
                      <div class="userComment d-flex flex-column align-items-center p-3">
                        <router-link :to="`/profile/${comment.UserId}`"><img :src="comment.User.url_profile_picture" :alt="comment.User.alt_profile_picture" class="imgComment"/></router-link>
                        <h4>{{ comment.User.username}}</h4>
                      </div>
                      <div class="commentText text-center pb-2 col-md-8">{{ comment.comment }}</div>
                    </div>

                    <!--COMMENTS OPTIONS-->
                    <i v-b-toggle="'optionsBtn'+index+indexComment" class="fas fa-cogs p-2 text-center"><span>Options du commentaire</span></i>
                    <b-collapse :id="'optionsBtn'+index+indexComment" class="border text-center pt-2">

                      <!--MODAL - COMMENT REPORT-->
                      <i class="far fa-flag" v-b-modal="modalCommentId(index, indexComment, 'report')" @click="isCommentReportClicked = true"><span>Signaler le commentaire</span></i>
                      <b-modal v-if="isCommentReportClicked === true" centered :id="'modalComment' + index + indexComment + 'report'" ok-only ok-title="Fermer" ok-variant="info" title="Signaler le contenu du Commentaire" @close="getComments(index)" @cancel="getComments(index)" @ok="getComments(index)">
                        <b-form-group
                        class="d-flex flex-column text-center mt-4 p-0"
                        label-for="commentReport"
                        label="Signalement :">
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
                      <i v-b-modal="modalCommentId(index, indexComment, 'delete')" v-if="comment.User.id === currentUser.id || currentUser.infos.role.includes('admin')" class="fas fa-trash-alt mb-2 mt-2"><span>Supprimer le commentaire</span></i>
                      <b-modal ok-title="Supprimer" centered ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalComment' + index + indexComment + 'delete'" title="Suppression du Commenntaire" @ok="deleteComment(index, indexComment), showAlertSuccess('Commentaire supprimé !')">
                        <div class="my-4">
                          Êtes vous sûr(e) de vouloir supprimer ce commentaire ?
                        </div>
                      </b-modal>

                      <!--MODAL - UPDATE COMMENT - IF USER IS COMMENT AUTHOR OR USER IS ADMIN-->
                      <i v-b-modal="modalCommentId(index, indexComment, 'update')" class="far fa-edit mt-2 mb-2" v-if="comment.User.id === currentUser.id || currentUser.infos.role.includes('admin')" @click="setCommentValue(indexComment, index), isClicked = true"><span>Modifier le commentaire</span></i>
                      <b-modal v-if="isClicked === true" centered ok-only ok-title="Fermer" ok-variant="info" :id="'modalComment' + index + indexComment + 'update'" title="Modification du Commentaire">
                        <div class="my-4">
                          <b-form enctype="multipart/form-data">
                            <b-form-group
                            label="Contenu du commentaire :"
                            label-for="commentUpdate"
                            class="text-center">
                              <b-form-textarea
                                      id="commentUpdate"
                                      v-model="userComment.comment"
                                      class="postInput text-center"
                                      rows="6"
                                      max-rows="12"
                              ></b-form-textarea>
                              <b-button v-b-modal.emojisComment3 class="mt-2 rounded-pill d-flex mr-auto ml-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                              <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment3" triggers="hover" placement="top">
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
                <div>

                  <!--ADD COMMENT-->
                  <b-button type="button" class="commentBtn rounded-pill mb-4 d-flex mr-auto ml-auto" @click="showTextArea()">Ajouter un commentaire</b-button>
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
                    ></b-form-textarea>
                    <b-button v-b-modal.emojisComment4 class="mt-2 rounded-pill d-flex ml-auto mr-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                    <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment4" triggers="hover" placement="top">
                      <div class="d-flex row m-2">
                        <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                      </div>
                    </b-modal>
                    <b-button type="submit" @click.prevent="addComment(index)" class="d-flex mt-4 commentBtn rounded-pill">Commenter</b-button>
                  </b-form-group>
                </div>
              </b-modal>
              <!--LIKES ICON-->
              <i v-if="!hasAlreadyLiked(index)" v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="far fa-thumbs-up mt-2"><span>{{ post.Likes.length }}</span></i>
              <i v-else v-b-modal="modalLikeId(index, 'like')" @click="getLikes(index)" class="fas fa-thumbs-up mt-2"><span>{{ post.Likes.length }}</span></i>

              <!--MODAL - GET LIKES-->
              <b-modal ok-only ok-title="Fermer" centered ok-variant="warning" :id="'modalLike' + index + 'like'" title="Like(s) du post" @ok="getUserPosts()" @close="getUserPosts()">
                <div class="my-4 d-flex p-2 flex-column flex-md-row align-items-center justify-content-center" v-for="like in likes" :key="like.id" id="like">
                  <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="imgComment"/></router-link>
                  <h4 class="d-flex col-md-9 justify-content-center justify-content-md-start">{{ like.username }}</h4>
                </div>
                <!--CHANGING BUTTON LIKE/DISLIKE-->
                <b-btn pill class="d-flex m-auto" :variant="btnLikeVariant" @click="createLike(index), showAlertSuccess()">{{ btnLike }}</b-btn>
              </b-modal>
            </div>
          </div>
        </div>

        <!--POST INFO-->
        <div class="d-flex flex-column col-lg-3 mr-lg-auto ml-lg-auto postTools mt-2 mt-md-0 mb-5 mb-md-0">
          <p>Créé le {{ post.createdAt.split(' ')[0].split('-')[2] }}-{{ post.createdAt.split(' ')[0].split('-')[1] }}-{{ post.createdAt.split(' ')[0].split('-')[0] }} à {{ post.createdAt.split(' ')[1].split(':')[0] }}h{{ post.createdAt.split(':')[1].split(':')[0]  }}</p>
          <p>Modifié le {{ post.updatedAt.split(' ')[0].split('-')[2] }}-{{ post.updatedAt.split(' ')[0].split('-')[1] }}-{{ post.updatedAt.split(' ')[0].split('-')[0] }} à {{ post.updatedAt.split(' ')[1].split(':')[0] }}h{{ post.updatedAt.split(':')[1].split(':')[0]  }}</p>

          <!--POST OPTIONS-->
          <i v-b-toggle="'postOptions' + index" class="fas fa-cogs mb-3"><span>Options du post</span></i>
          <b-collapse :id="'postOptions' + index" class="mb-4 mb-md-0">

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
                            class="postInput mb-3"
                            rows="3"
                            max-rows="6"
                    >{{ userPost.content }}</b-form-textarea>
                    <b-button v-b-modal.emojis3 class="mt-1 mb-3 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                    <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojis3" triggers="hover" placement="top">
                      <div class="d-flex row m-2">
                        <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
                      </div>
                    </b-modal>
                    <div id="postUpdate">
                      <!--PREVIEW NEW GIF-->
                      <img :src="userPost.img" v-if="url.length === 0" class="img-fluid imgPosts d-flex m-auto" id="updateImg" :alt="userPost.altImg"/>
                      <img v-else :src="url" class="img-fluid imgPosts d-flex" alt="Preview new image">
                      <b-form-file v-model="file" class="mt-3 mb-3" @change="onFileChanged"></b-form-file>
                    </div>
                    <b-button type="submit" @click.prevent="updatePost(index), showAlertSuccess('Post modifié !')" class="d-flex rounded-pill commentBtn">Modifier</b-button>
                  </b-form-group>
                </b-form>
              </div>
            </b-modal>
          </b-collapse>
        </div>
      </div>
    </section>

    <!--ACCOUNT PARAMETERS-->
    <section class="d-flex flex-column align-items-center container pb-5" id="accountParam">
      <h2 class="rounded-pill p-2 titleConfig mb-5 mt-md-2 col-12">Paramètres du compte</h2>
      <div class="container-fluid d-flex flex-column flex-md-row justify-content-around mb-5">

        <!--DOWNLOAD CURRENT USER INFO-->
        <b-btn variant="info" @click="downloadInfo()" class="col-md-5 mb-3 mb-md-0">Télécharger les informations du compte</b-btn>

        <!--MODAL - DELETE ACCOUNT-->
        <b-btn v-b-modal.modalAccount variant="danger" class="col-md-5">Supprimer le compte</b-btn>
        <b-modal centered ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" id="modalAccount" title="Suppression du compte" @ok="deleteAccount">
          <div class="my-4">
            Êtes vous sûr(e) de vouloir supprimer votre compte ?
          </div>
        </b-modal>
      </div>

      <!--CONSENTS-->
      <div class="container-fluid d-flex flex-column m-auto justify-content-around">
        <h3 id="consentsTitle">Consentements pour le traitement de vos données</h3>
        <div>
          <b-form-group label="Acceptez-vous que nous partagions vos informations avec nos partenaires commerciaux ?">
            <b-form-radio v-model="newConsents.shareable" name="shareable" value=true @change="consentsHaveChanged = true">Oui</b-form-radio>
            <b-form-radio v-model="newConsents.shareable" name="shareable" value=false @change="consentsHaveChanged = true">Non</b-form-radio>
          </b-form-group>
        </div>
        <div>
          <b-form-group label="Acceptez-vous d'être contacté par nos services (notifications, newsletter, ...) ?">
            <b-form-radio v-model="newConsents.contactable" name="contactable" value=true @change="consentsHaveChanged = true">Oui</b-form-radio>
            <b-form-radio v-model="newConsents.contactable" name="contactable" value=false @change="consentsHaveChanged = true">Non</b-form-radio>
          </b-form-group>
        </div>
      </div>
      <b-button v-if="consentsHaveChanged" @click="updateUser()" variant="outline-info" pill>Valider les changements</b-button>
    </section>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
import linkifyHTML from 'linkifyjs/html'
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
}
export default {
  name: 'accountCurrentUser',
  data () {
    return {
      newConsents: {
        contactable: JSON.parse(this.$store.state.user.currentUser.infos.consents).contactable,
        shareable: JSON.parse(this.$store.state.user.currentUser.infos.consents).shareable
      },
      userRole: JSON.parse(this.$store.state.user.currentUser.infos.role),
      file: null,
      userInfo: {
        email: this.$store.state.user.currentUser.infos.email,
        password: this.$store.state.user.currentUser.infos.password,
        username: this.$store.state.user.currentUser.infos.username,
        bio: this.$store.state.user.currentUser.infos.bio,
        newPassword: ''
      },
      userPost: {
        title: '',
        content: '',
        img: '',
        altImg: ''
      },
      url: '',
      likes: '',
      btnLike: '',
      btnLikeVariant: '',
      userComment: {
        comment: null,
        clicked: false
      },
      emojis: this.$store.state.posts.emojis,
      commentReport: null,
      consentsHaveChanged: false,
      isClicked: false,
      isCommentReportClicked: false
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
        position: 'center',
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
      const file = e.target.files[0]
      this.url = URL.createObjectURL(file)
    },
    updatePost (index) {
      let postId = this.userPosts[index].id
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
    getComments (index) {
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
        this.isCommentReportClicked = false
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
    },
    updateUser () {
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('email', this.userInfo.email)
      formData.append('password', this.userInfo.newPassword)
      formData.append('username', this.userInfo.username)
      formData.append('bio', this.userInfo.bio)
      formData.append('shareable', this.newConsents.shareable)
      formData.append('contactable', this.newConsents.contactable)
      let payload = {
        userId: this.$store.state.user.currentUser.id,
        formData: formData
      }
      this.$store.dispatch('user/updateUser', payload)
        .then(() => {
          this.showAlertSuccess('Informations modifiées !')
          this.consentsHaveChanged = false
          this.$store.dispatch('user/getCurrentUser', this.$store.state.user.currentUser.id)
            .then(() => console.log(this.$store.state.user.currentUser))
        })
    },
    deleteAccount () {
      if(this.currentUser.infos.role.includes('admin')){
        this.$store.dispatch('user/getAllUser')
          .then(response => {
            let adminUser = []
            response.data.users.forEach(user => {
              if(user.role.includes('admin') && user.id !== this.currentUser.id){
                adminUser.push(user)
              }
            })
            if(adminUser.length !== 0){
              this.$store.dispatch('user/deleteUser', this.$store.state.user.currentUser.id)
                      .then(() => {
                        this.$cookies.remove('user')
                        this.$store.state.user.currentUser = {
                          id: '',
                          infos: {}
                        }
                        this.$router.push({name: 'auth'})
                      })
            } else {
              this.showAlertError(`Vous devez donner le privilège "admin" a au moins un utilisateur avant de pouvoir supprimer votre compte !`, '5000')
            }
          })
      } else {
        this.$store.dispatch('user/deleteUser', this.$store.state.user.currentUser.id)
                .then(() => {
                  this.$cookies.remove('user')
                  this.$store.state.user.currentUser = {
                    id: '',
                    infos: {}
                  }
                  this.$router.push({name: 'auth'})
                })
      }
    },
    downloadInfo () {
      this.$store.dispatch('user/getOneUser', this.$store.state.user.currentUser.id)
        .then((user) => {
          let posts = []
          let comments = []
          let likes = []
          if (user.data.Posts.length === 0) {
            posts.push(`Vous n'avez rien posté !`)
          } else {
            for (let i in user.data.Posts) {
              for (const [key, value] of Object.entries(user.data.Posts[i])) {
                posts.push(`${key} : ${value}`)
              }
            }
          }
          if (user.data.Comments.length === 0) {
            comments.push(`Vous n'avez rien commenté !`)
          } else {
            for (let j in user.data.Comments) {
              for (const [key, value] of Object.entries(user.data.Comments[j])) {
                comments.push(`${key} : ${value}`)
              }
            }
          }
          if (user.data.Likes.length === 0) {
            likes.push(`Vous n'avez rien liké !`)
          } else {
            for (let k in user.data.Likes) {
              for (const [key, value] of Object.entries(user.data.Likes[k])) {
                likes.push(`${key} : ${value}`)
              }
            }
          }
          const document = {
            content: [
              {
                text: 'All your information\n\n',
                style: 'header'
              },
              {
                text: 'User Info\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  `id : ${user.data.id}`,
                  `email : ${user.data.email}`,
                  `password : ${user.data.password}`,
                  `username : ${user.data.username}`,
                  `role : ${user.data.role}`,
                  `bio : ${user.data.bio}`,
                  `url_profile_picture : ${user.data.url_profile_picture}`,
                  `alt_profile_picture : ${user.data.alt_profile_picture}`,
                  `created at : ${user.data.createdAt}`,
                  `updated at : ${user.data.updatedAt}\n\n`
                ]
              },
              {
                text: 'Posts\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  posts
                ]
              },
              {
                text: '\n\nComments\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  comments
                ]
              },
              {
                text: '\n\nLikes\n\n',
                style: 'subheader'
              },
              {
                ul: [
                  likes
                ]
              }
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true
              },
              subheader: {
                fontSize: 15,
                bold: true
              }
            }
          }
          pdfMake.createPdf(document).download()
        })
    }
  },
  beforeMount () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('posts/getAllPostsFromOneUser', this.$store.state.user.currentUser.id)
    }
  }
}
</script>

<style scoped>
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
  .postTools{
    flex-grow: 1;
  }
  .fa-cogs, .fa-cogs span{
    font-size: 20px;
  }
  i, i span{
    font-size: 15px;
  }
  i:hover{
    text-shadow: 0 0 1px #0080C0;
  }
  .modal i span {
    font-size: 15px
  }
  button{
    box-shadow: 0 0 6px black;
  }
  #userPart{
    background-image: url('../assets/img/bgUser.png');
    background-size: cover;
    border-radius: 25px;
  }
  .userPhoto{
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
  }
  #userInfos{
    font-size: 18px;
    background-color: rgba(215, 215, 215, 1);
    border: 4px double #0762a3;
  }
  .infoTitle{
    color: #0762a3;
  }
  h1{
    font-size: 35px;
  }
  h2{
    font-size: 25px;
  }
  h3{
    font-size: 22px;
  }
  #consentsTitle{
    text-decoration: underline;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  .commentBtn{
    background-color: #2C3F5F;
    color: white;
  }
</style>
