<template>
  <div class="container flex-column pt-4" id="containerbg">
    <h1 class="titleConfig rounded-pill">Votre compte</h1>
    <section class="container-fluid d-flex flex-column align-items-center col-12" id="userPart">
      <div class="d-flex row m-auto col-12 justify-content-around align-items-center">
        <div class="d-flex flex-column align-items-center">
          <img :src="currentUser.infos.url_profile_picture" class="userPhoto mb-5">
          <i class="far fa-edit" v-b-modal.updateProfile><span>Editer les informations</span></i>
          <b-modal ok-title="Modifier" ok-variant="info" cancel-title="Annuler" cancel-variant="warning" id="updateProfile" title="Editer vos informations" @ok="updateUser">
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
                <b-form-input id="input-2" v-model="userInfo.password"></b-form-input>
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
                :state="Boolean(file)"
                placeholder="Choisissez une nouvelle image de profil ..."
                plain
              ></b-form-file>
            </div>
          </b-modal>
        </div>
        <div id="userInfos" class="col-6">
          <h2 class="mb-5">Vos informations</h2>
          <div class="d-flex row mt-2 border-bottom"><p class="mr-4 infoTitle">Email : </p><p>{{ currentUser.infos.email }}</p></div>
          <div class="d-flex row mt-2 border-bottom"><p class="mr-4 infoTitle">Mot de passe (ici masqué) : </p><p>{{ currentUser.infos.password }}</p></div>
          <div class="d-flex row mt-2 border-bottom"><p class="mr-4 infoTitle">Nom d'utilisateur : </p><p>{{ currentUser.infos.username }}</p></div>
          <div class="d-flex row mt-2" v-if="currentUser.infos.bio !== ''"><p class="mr-4 infoTitle">Bio : </p><p>{{ currentUser.infos.bio }}</p></div>
        </div>
      </div>
    </section>
    <section class="d-flex flex-column align-items-center container">
      <h2 class="col-12 rounded-pill p-2 titleConfig">Vos publications</h2>
      <div v-if="userPosts.length === 0" class="d-flex flex-column align-items-center justify-content-md-between allPosts">
        <h3 class="m-auto pt-3">Vous n'avez rien posté pour le moment, Lancez-vous !</h3>
        <p class="m-auto mt-2">Si vous ne savez pas comment faire, regardez le tutoriel dans le carrousel sur le <router-link to="/wall">mur principal</router-link> ou retrouvez nos astuces dans la section FAQ !!</p>
        <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts">
      </div>
      <div class="d-flex container-fluid row align-items-center justify-content-md-between allPosts" v-for="(post, index) in userPosts" :key="index">
        <div class="d-flex col-9 justify-content-center align-items-center formPart">
          <div class="d-flex col-9 flex-column">
            <h3>{{ post.title }}</h3>
            <p v-html="getLinks(post.content)"></p>
            <img :src="post.url_gif" v-if="post.url_gif" :alt="post.alt_gif" class="img-fluid imgPosts"/>
            <div class="d-flex row m-auto col-6 justify-content-around">
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
        <div class="d-flex flex-column postTools">
          <p>Créé le {{ post.createdAt.split(' ')[0].split('-')[2] }}-{{ post.createdAt.split(' ')[0].split('-')[1] }}-{{ post.createdAt.split(' ')[0].split('-')[0] }} à {{ post.createdAt.split(' ')[1].split(':')[0] }}h{{ post.createdAt.split(':')[1].split(':')[0]  }}</p>
          <p>Modifié le {{ post.updatedAt.split(' ')[0].split('-')[2] }}-{{ post.updatedAt.split(' ')[0].split('-')[1] }}-{{ post.updatedAt.split(' ')[0].split('-')[0] }} à {{ post.updatedAt.split(' ')[1].split(':')[0] }}h{{ post.updatedAt.split(':')[1].split(':')[0]  }}</p>
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
    </section>
    <section class="d-flex flex-column align-items-center container pb-5" id="accountParam">
      <h2 class="col-12 rounded-pill p-2 titleConfig mb-5">Paramètres du compte</h2>
      <div class="container-fluid d-flex justify-content-around mb-5">
        <b-btn variant="info" @click="downloadInfo()" class="col-5">Télécharger les informations du compte</b-btn>
        <b-btn v-b-modal.modalAccount variant="danger" class="col-5">Supprimer le compte</b-btn>
        <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" id="modalAccount" title="Suppression du compte" @ok="deleteAccount">
          <div class="my-4">
            Êtes vous sûr(e) de vouloir supprimer votre compte ?
          </div>
        </b-modal>
      </div>
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
    <account-admin v-if="userRole.includes('admin')"></account-admin>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
import linkifyHTML from 'linkifyjs/html'
import AccountAdmin from './account_admin'
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
  components: {AccountAdmin},
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
        bio: this.$store.state.user.currentUser.infos.bio
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
      commentReport: null,
      consentsHaveChanged: false
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
      console.log(this.newConsents)
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
    },
    updateUser () {
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('email', this.userInfo.email)
      formData.append('password', this.userInfo.password)
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
          this.consentsHaveChanged = false
          this.$store.dispatch('user/getCurrentUser', this.$store.state.user.currentUser.id)
            .then(() => console.log(this.$store.state.user.currentUser))
        })
    },
    deleteAccount () {
      this.$store.dispatch('user/deleteUser', this.$store.state.user.currentUser.id)
        .then(() => {
          this.$cookies.remove('user')
          this.$store.state.user.currentUser = {
            id: '',
            infos: {}
          }
          this.$router.push({name: 'auth'})
        })
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
  .allPosts{
    flex: 0 0 100%;
  }
  .formPart{
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 12px black;
    padding: 2%;
    margin: 2% 0;
  }
  .postTools{
    flex: 0 0 15%;
    flex-grow: 1;
  }
  i, i span{
    font-size: 20px;
  }
  i span:hover{
    text-shadow: 0 0 2px black;
  }
  .modal i span {
    font-size: 15px
  }
  button{
    box-shadow: 0 0 6px black;
  }
  #containerbg{
    box-shadow: 0 0 12px black;
    background-color: #F7F7F7;
  }
  #userPart{
    margin: 2% 0;
    padding: 2%;
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
  #userInfos{
    font-size: 18px;
    background-color: rgba(215, 215, 215, 0.2);
    padding: 3%;
    box-sizing: border-box;
    word-break: break-word;
    border: 4px double #0762a3;
  }
  .infoTitle{
    color: #0762a3;
  }
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
  #consentsTitle{
    text-decoration: underline;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
</style>
