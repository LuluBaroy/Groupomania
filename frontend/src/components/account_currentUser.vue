<template>
  <div class="col-lg-9 m-auto flex-column pt-4 pl-1 pr-1 p-3" id="containerbg">
    <h1 class="titleConfig rounded-pill p-2 mb-4">Votre compte</h1>

    <!--USER INFO'S PART-->
    <section class="container-fluid d-flex flex-column align-items-center p-0 p-lg-3" id="userPart">
      <div class="d-flex row m-auto justify-content-around align-items-center">
        <div class="d-flex flex-column align-items-center">
          <img :src="currentUser.infos.url_profile_picture" :alt="currentUser.infos.alt_profile_picture" class="userPhoto mt-4 mb-4 mb-md-5">

          <!--MODAL - EDIT INFO-->
          <i class="far fa-edit mb-4 mb-md-0" v-b-modal.updateProfile @click="showModalUser = true"><span>Editer les informations</span></i>
          <b-modal v-if="showModalUser === true" centered ok-title="Modifier" ref="test" ok-variant="info" cancel-title="Annuler" cancel-variant="warning" id="updateProfile" title="Editer vos informations" @ok.prevent="updateUser(), url=''" @close="url = ''" @hidden="url = ''" @cancel="url= ''">
            <div class="my-4">
              <b-form-group
                id="fieldset-1"
                label="Email : "
                label-for="input-1"
              >
                <b-form-input id="input-1" v-model="userInfo.email" :state="stateEmail"></b-form-input>
                <b-form-invalid-feedback>
                  Merci de renseigner un email valide
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="fieldset-2"
                label="Mot de passe : "
                label-for="input-2"
              >
                <b-form-input id="input-2" v-model="userInfo.newPassword" :state="statePassword"></b-form-input>
                <b-form-invalid-feedback>
                  Merci de renseigner un mot de passe contenant au moins 8 caractères dont une majuscule et un chiffre
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="fieldset-3"
                label="Nom d'utilisateur : "
                label-for="input-3"
              >
                <b-form-input id="input-3" v-model="userInfo.username" :state="stateUsername"></b-form-input>
                <b-form-invalid-feedback>
                  Merci de renseigner un nom d'utilisateur contenant au minimum 6 caractères ne contenant que des lettres et/ou chiffres (espace(s) accepté(s))
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="fieldset-4"
                label="Bio : "
                label-for="input-4"
              >
                <b-form-textarea id="input-4" rows="2" max-rows="4" placeholder="Partagez quelques informations à propos de vous..." v-model="userInfo.bio" :state="stateBio">{{ userInfo.bio }}</b-form-textarea>
                <b-form-invalid-feedback>
                  Merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                </b-form-invalid-feedback>
              </b-form-group>
              <div>
                <!--PREVIEW NEW PROFILE PICTURE-->
                <img :src="currentUser.infos.url_profile_picture" v-if="url.length === 0" class="userPhoto d-flex m-auto" :alt="currentUser.infos.alt_profile_picture"/>
                <img v-else :src="url" class="img-fluid mr-auto ml-auto userPhoto d-flex" alt="Preview new image">
                <b-form-group
                        label="Image du profil :"
                        label-for="fileInput"
                        description="Fichiers acceptés : 'jpg', 'jpeg', 'png', 'gif'"
                        class="mt-3">
                  <b-form-file id="fileInput" v-model="file" accept=".jpg, .png, .gif, .jpeg" @change="onFileChanged"></b-form-file>
                </b-form-group>
              </div>
            </div>
          </b-modal>
        </div>

        <!--USER INFO-->
        <div id="userInfos" class="col-md-6 mb-3 mb-md-0 m-md-2 text-break">
          <h2 class="mb-2 mt-md-3 mb-md-3">Vos informations</h2>
          <b-list-group>
            <b-list-group-item class="d-flex flex-column align-items-center justify-content-center">
              <p class="infoTitle">Email : </p>
              <p>{{ currentUser.infos.email }}</p>
            </b-list-group-item>
            <b-list-group-item class="d-flex flex-column align-items-center justify-content-center">
              <p class="infoTitle">Mot de passe (ici masqué) : </p>
              <p>{{ currentUser.infos.password }}</p>
            </b-list-group-item>
            <b-list-group-item class="d-flex flex-column align-items-center justify-content-center">
              <p class="infoTitle">Nom d'utilisateur : </p>
              <p>{{ currentUser.infos.username }}</p>
            </b-list-group-item>
            <b-list-group-item v-if="currentUser.infos.bio !== ''" class="d-flex flex-column align-items-center justify-content-center">
              <p class="infoTitle">Bio : </p>
              <p>{{ currentUser.infos.bio }}</p>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </section>

    <!--USER'S POSTS-->
    <section class="d-flex flex-column align-items-center container p-0 mt-4">
      <h2 class="rounded-pill p-2 p-lg-3 titleConfig mb-4 col-12">Vos publications</h2>

      <!--NO POST PUBLISHED-->
      <article v-if="userPosts.length === 0" class="d-flex flex-column align-items-center justify-content-md-between allPosts">
        <h3 class="pt-md-3">Vous n'avez rien posté pour le moment, Lancez-vous !</h3>
        <p>Rendez-vous sur le <router-link to="/wall">mur principal</router-link> (si vous ne savez pas comment faire, vous pouvez consulter nos astuces dans la rubrique "FAQ" !)</p>
        <img src="../assets/img/hello.gif" alt="hello gif" class="img-fluid imgPosts mt-2 mb-5">
      </article>

      <!--ALL USER'S POSTS-->
      <article class="d-flex flex-column p-0 container-fluid flex-md-row align-items-center mb-md-3 pb-md-3 justify-content-md-between allPosts" v-for="(post, index) in userPosts" :key="index">
        <div class="d-flex col-md-9 col-lg-8 mr-lg-auto ml-lg-auto justify-content-center align-items-center formPart">

          <!--POST TITLE + CONTENT + GIF-->
          <div class="d-flex col-md-9 flex-column">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
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
                                  :state="stateCommentReport"
                          ></b-form-textarea>
                          <b-form-invalid-feedback>
                            Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                          </b-form-invalid-feedback>
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
                      <i v-b-modal="modalCommentId(index, indexComment, 'update')" class="far fa-edit mt-2 mb-2" v-if="comment.User.id === currentUser.id || currentUser.infos.role.includes('admin')" @click="setCommentValue(indexComment, index), isClickedComment = true"><span>Modifier le commentaire</span></i>
                      <b-modal v-if="isClickedComment === true" centered ok-only ok-title="Fermer" ok-variant="info" :id="'modalComment' + index + indexComment + 'update'" title="Modification du Commentaire">
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
                                      :state="stateComment"
                              ></b-form-textarea>
                              <b-form-invalid-feedback>
                                Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                              </b-form-invalid-feedback>
                              <b-button v-b-modal.emojisComment3 class="mt-2 rounded-pill d-flex mr-auto ml-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                              <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisComment3" triggers="hover" placement="top">
                                <div class="d-flex row m-2">
                                  <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                                </div>
                              </b-modal>
                              <b-button type="submit" @click.prevent="updateComment(index, indexComment)" class="d-flex commentBtn rounded-pill">Modifier</b-button>
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
                            :state="stateComment"
                    ></b-form-textarea>
                    <b-form-invalid-feedback>
                      Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                    </b-form-invalid-feedback>
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
                      Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid"/>
                    </b-form-invalid-feedback>
                    <b-button v-b-modal.emojis3 class="mt-1 mb-3 rounded-pill" variant="dark">😃 Ajouter des emoticones !</b-button>
                    <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojis3" triggers="hover" placement="top">
                      <div class="d-flex row m-2">
                        <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
                      </div>
                    </b-modal>
                  </b-form-group>
                  <div id="postUpdate">
                    <!--PREVIEW NEW GIF-->
                    <img :src="userPost.img" v-if="url.length === 0" class="img-fluid imgPosts d-flex m-auto" id="updateImg" :alt="userPost.altImg"/>
                    <img v-else :src="url" class="img-fluid ml-auto mr-auto imgPosts d-flex" alt="Preview new image">
                    <b-form-group
                            label="Votre Gif :"
                            label-for="fileInput"
                            description="Fichiers acceptés : 'jpg', 'jpeg', 'png', 'gif'"
                            class="mt-3 text-center">
                      <b-form-file id="fileInput" v-model="file" accept=".jpg, .png, .gif, .jpeg" @change="onFileChanged"></b-form-file>
                    </b-form-group>
                  </div>
                  <b-button type="submit" @click.prevent="updatePost(index)" class="d-flex rounded-pill commentBtn">Modifier</b-button>
                </b-form>
              </div>
            </b-modal>
          </b-collapse>
        </div>
      </article>
    </section>

    <!--ACCOUNT PARAMETERS-->
    <section class="d-flex flex-column align-items-center container pb-5" id="accountParam">
      <h2 class="rounded-pill p-2 titleConfig mb-5 mt-md-2 col-12">Paramètres du compte</h2>
      <article class="container-fluid d-flex flex-column flex-md-row justify-content-around mb-5">

        <!--DOWNLOAD CURRENT USER INFO-->
        <b-btn variant="info" @click="downloadInfo()" class="col-md-5 mb-3 mb-md-0">Télécharger les informations du compte</b-btn>

        <!--MODAL - DELETE ACCOUNT-->
        <b-btn v-b-modal.modalAccount variant="danger" class="col-md-5">Supprimer le compte</b-btn>
        <b-modal centered ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" id="modalAccount" title="Suppression du compte" @ok="deleteAccount">
          <div class="my-4">
            Êtes vous sûr(e) de vouloir supprimer votre compte ?
          </div>
        </b-modal>
      </article>

      <!--CONSENTS-->
      <article class="container-fluid d-flex flex-column m-auto justify-content-around">
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
      </article>
      <b-button v-if="consentsHaveChanged" @click="updateUser()" variant="outline-info" pill>Valider les changements</b-button>
    </section>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
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
        comment: '',
        clicked: false
      },
      emojis: this.$store.state.posts.emojis,
      commentReport: '',
      consentsHaveChanged: false,
      isClicked: false,
      isClickedComment: false,
      isCommentReportClicked: false,
      showModalUser: false
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
    stateEmail () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      if(regex.test(this.userInfo.email)){
        return true
      } else if (!regex.test(this.userInfo.email) && this.userInfo.email.length !== 0) {
        return false
      } else {
        return null
      }
    },
    statePassword () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}/)
      if(this.userInfo.newPassword.length < 8 && this.userInfo.newPassword.length > 0 || this.userInfo.newPassword.length > 0 && !regex.test(this.userInfo.newPassword)){
        return false
      } else if (this.userInfo.newPassword.length > 0 && this.userInfo.newPassword.length > 8 && regex.test(this.userInfo.newPassword) || this.userInfo.newPassword.length === 8 && regex.test(this.userInfo.newPassword)){
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
      if (this.userInfo.username.length > 0 && this.userInfo.username.length < 6 || this.userInfo.username.length > 0 && regex.test(this.userInfo.username) || this.userInfo.username.length > 0 && !regex2.test(this.userInfo.username)){
        return false
      } else if (this.userInfo.username.length > 6 && regex2.test(this.userInfo.username) && !regex.test(this.userInfo.username) || this.userInfo.username.length === 6 && regex2.test(this.userInfo.username) && !regex.test(this.userInfo.username)){
        return true
      } else {
        return null
      }
    },
    stateBio () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/)
      if(this.userInfo.bio !== null && this.userInfo.bio.length > 0 && !regex.test(this.userInfo.bio)){
        return true
      } else if (this.userInfo.bio !== null && this.userInfo.bio.length > 0 && regex.test(this.userInfo.bio) || regex.test(this.userInfo.bio)) {
        return false
      } else {
        return null
      }
    },
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
    //POSTS
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
                  this.showAlertSuccess('Post modifié !')
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

    //COMMENTS
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
    hasCommented (index) {
      if (this.userPosts[index].Comments.filter(comment => comment.user_id === this.currentUser.id).length !== 0) {
        return true
      }
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
      if (this.userComment.comment.length === 0 || this.stateComment !== true) {
        this.showAlertError('Merci de renseigner les différents champs', '1500')
      } else {
        let postId = this.userPosts[index].id
        let payload = {
          id: postId,
          newComment: {
            comment: this.userComment.comment.toString()
          }
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
          this.userComment.comment = comment.data.comment
        }).catch(() => {
          this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
        })
    },
    updateComment (index, indexComment) {
      console.log(this.comments[indexComment])
      if(this.stateComment !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let postId = this.userPosts[index].id
        let payload = {
          id: postId,
          commentId: this.comments[indexComment].id,
          newComment: {
            comment: this.userComment.comment.toString()
          }
        }
        this.isClickedComment = false
        this.$store.dispatch('posts/updateComment', payload)
                .then(() => {
                  this.showAlertSuccess('Commentaire modifié !')
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
        this.isCommentReportClicked = false
        this.showAlertSuccess('Commentaire signalé !')
        this.$store.dispatch('posts/sendCommentReport', payload)
          .then(() => {
            this.commentReport = ''
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

    //USERS OPTIONS
    updateUser () {
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      if(this.stateEmail === false || this.statePassword === false || this.stateUsername === false || this.stateBio === false){
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else if (this.file !== null && !authorizedFile.includes(this.file.name.split('.')[1])) {
        this.showAlertError("Ce type de fichier n'est pas autorisé", '1500')
      } else {
        this.showModalUser = false
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
                })
      }
    },
    deleteAccount () {
      if(this.currentUser.infos.role.includes('admin')){
        this.$store.dispatch('user/getAllUser')
            .then(response => {
               let adminUser = []
               response.data.forEach(user => {
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
    background-color: rgba(215, 215, 215, 0.7);
    border: 4px double #0762a3;
    box-shadow: 0 0 4px black;
  }
  .list-group-item{
    background-color: rgba(215, 215, 215, 0.3);
    padding: 0;
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
  div .list-group-item:last-child {
    margin-bottom: 5%;
  }
</style>
