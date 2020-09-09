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
          <i v-b-modal="modalFourId(index)" class="fas fa-trash-alt"><span>Supprimer le post</span></i>
          <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalFour' + index" title="Suppression du Post" @ok="deletePost(index), showAlertDeletePost()">
            <div class="my-4">
              Êtes vous sûr(e) de vouloir supprimer ce post ?
            </div>
          </b-modal>
          <i v-b-modal="modalTerId(index)" class="far fa-edit" @click="setPostValue(index)"><span>Modifier le post</span></i>
          <b-modal ok-only ok-title="Cancel" :id="'modalTer' + index" title="Modification du Post">
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
                    <b-form-file v-model="file" class="mt-3" plain></b-form-file>
                  </div>
                  <b-button type="submit" @click.prevent="updatePost(index), showAlertUpdatePost()" class="commentBtn">Modifier</b-button>
                </b-form-group>
              </b-form>
            </div>
          </b-modal>
        </div>
      </div>
      <div class="d-flex formPart flex-column col-8">
        <h4>{{ post.title }}</h4>
        <p id="test" v-html="getLinks(post.content)"></p>
        <img :src="post.url_gif" v-if="post.url_gif" :alt="post.alt_gif" class="img-fluid imgPosts"/>
        <div class="d-flex row justify-content-around">
          <div id="postInfo">
            <i class="far fa-flag" v-b-modal="modalSevenId(index)"></i>
            <b-modal :id="'modalSeven' + index" title="Signaler le contenu du Post" @close="getPosts" @cancel="getPosts" @ok="getPosts">
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
            <div v-b-modal="modalId(index)" @click="getComments(index)"><i class="far fa-comments"><span>{{ post.Comments.length }}</span></i></div>
            <b-modal :id="'modal' + index" title="Commentaire(s) du post" @close="getPosts" @cancel="getPosts" @ok="getPosts">
              <div class="my-4 commentsConfig" v-for="(comment, indexComment) in comments" v-if="comment.PostId === posts[index].id" :key="comment.id">
                <div class="d-flex justify-content-end flex-column">
                  <i class="far fa-flag" v-b-modal="modalEightId(indexComment)"></i>
                  <b-modal :id="'modalEight' + indexComment" title="Signaler le contenu du Commentaire" @close="getComments(index)" @cancel="getComments(index)" @ok="getComments(index)">
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
                    <i v-b-modal="modalFiveId(indexComment)" class="fas fa-trash-alt"><span>Supprimer le commentaire</span></i>
                    <b-modal ok-title="Supprimer" ok-variant="danger" cancel-title="Annuler" cancel-variant="info" :id="'modalFive' + indexComment" title="Suppression du Commenntaire" @ok="deleteComment(index, indexComment), showAlertDeleteComment()">
                      <div class="my-4">
                        Êtes vous sûr(e) de vouloir supprimer ce commentaire ?
                      </div>
                    </b-modal>
                    <i v-b-modal="modalSixId(indexComment)" class="far fa-edit" @click="setCommentValue(indexComment, index)"><span>Modifier le commentaire</span></i>
                    <b-modal ok-only ok-title="Cancel" :ref="'modalSix' + indexComment" :id="'modalSix' + indexComment" title="Modification du Commentaire">
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
                            <b-button type="submit" @click.prevent="updateComment(index, indexComment), hideModal(modalSixId(indexComment)), showAlertUpdateComment()" class="commentBtn">Modifier</b-button>
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
            <div v-b-modal="modalBisId(index)" @click="getLikes(index)"><i class="far fa-thumbs-up"><span>{{ post.Likes.length }}</span></i></div>
            <b-modal ok-only ok-title="Fermer" ok-variant="warning" :id="'modalBis' + index" title="Like(s) du post" @ok="getPosts(index)" @close="getPosts(index)">
              <div class="my-4 d-flex row align-items-center col-12 justify-content-between" v-for="like in likes" :key="like.id" id="like">
                <router-link :to="`/profile/${like.id}`"><img :src="like.url_profile_picture" :alt="like.alt_profile_picture" class="img-fluid imgComment"/></router-link>
                <h4 class="d-flex username">{{ like.username }}</h4>
              </div>
              <b-btn pill class="d-flex m-auto" variant="info" @click="createLike(index), showAlertAddLike()">Liker</b-btn>
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
        content: ''
      },
      slide: 0,
      sliding: null,
      file: null,
      likes: null,
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
    posts () {
      return this.$store.state.posts.allPosts
    },
    comments () {
      return this.$store.state.posts.allComments
    }
  },
  methods: {
    showAlertDeletePost () {
      this.$swal({
        title: 'Post supprimé !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertUpdatePost () {
      this.$swal({
        title: 'Post modifié !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertReportPost () {
      this.$swal({
        title: 'Post signalé !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertReportComment () {
      this.$swal({
        title: 'Commentaire signalé !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertDeleteComment () {
      this.$swal({
        title: 'Commentaire supprimé !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertUpdateComment () {
      this.$swal({
        title: 'Commentaire modifié !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertAddComment () {
      this.$swal({
        title: 'Commentaire ajouté !',
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertAddLike () {
      this.$swal({
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: '1500'})
    },
    showAlertError () {
      this.$swal({
        title: 'Merci de renseigner les différents champs',
        position: 'center',
        icon: 'error',
        showConfirmButton: false,
        timer: '1500'})
    },
    getPosts () {
      this.$store.dispatch('posts/getAllPosts')
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
          if (post.data.url_gif !== null) {
            let img = document.createElement('img')
            img.src = post.data.url_gif
            img.class = 'img-fluid'
            img.alt = post.data.alt_gif
            document.getElementById('postUpdate').appendChild(img)
          }
        })
    },
    updatePost (index) {
      let postId = this.posts[index].id
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('title', this.userPost.title)
      formData.append('content', this.userPost.content)
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
        })
    },
    deletePost (index) {
      let postId = this.posts[index].id
      this.$store.dispatch('posts/deletePost', postId)
        .then(() => {
          this.getPosts()
        })
    },
    sendPostReport (index) {
      if (this.postReport === null) {
        this.showAlertError()
      } else {
        let payload = {
          id: this.posts[index].id,
          newReport: {
            report: this.postReport
          }
        }
        this.showAlertReportPost()
        this.$store.dispatch('posts/sendPostReport', payload)
          .then(() => {
            this.postReport = null
          })
      }
    },
    getComments (index) {
      let postId = this.posts[index].id
      console.log(this.$cookies.get('user'))
      this.$store.dispatch('posts/getComments', postId)
    },
    showTextArea () {
      this.userComment.clicked = true
    },
    addComment (index) {
      if (this.userComment.comment === null) {
        this.showAlertError()
      } else {
        let postId = this.posts[index].id
        let payload = {
          id: postId,
          newComment: {
            comment: this.userComment.comment
          }
        }
        this.showAlertAddComment()
        this.$store.dispatch('posts/createComment', payload)
          .then(() => {
            this.userComment.clicked = false
            this.userComment.comment = ''
            this.getComments(index)
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
        })
    },
    updateComment (index, indexComment) {
      let payload = {
        id: this.posts[index].id,
        commentId: this.comments[indexComment].id,
        newComment: {
          comment: this.userComment.comment
        }
      }
      this.$store.dispatch('posts/updateComment', payload)
        .then(() => {
          this.getComments(index)
          this.userComment.comment = ''
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
        })
    },
    sendCommentReport (index, indexComment) {
      if (this.commentReport === null) {
        this.showAlertError()
      } else {
        let payload = {
          id: this.posts[index].id,
          commentId: this.comments[indexComment].id,
          newReport: {
            report: this.commentReport
          }
        }
        this.showAlertReportComment()
        this.$store.dispatch('posts/sendCommentReport', payload)
          .then(() => {
            this.commentReport = null
          })
      }
    },
    getLikes (index) {
      let postId = this.posts[index].id
      this.$store.dispatch('posts/getLikes', postId)
        .then(response => {
          this.likes = response.data
        })
    },
    createLike (index) {
      let postId = this.posts[index].id
      this.$store.dispatch('posts/createLike', postId)
        .then(() => {
          this.getLikes(index)
        })
    },
    hideModal (id) {
      this.$refs[id][0].hide()
    },
    modalId (index) {
      return 'modal' + index
    },
    modalBisId (index) {
      return 'modalBis' + index
    },
    modalTerId (index) {
      return 'modalTer' + index
    },
    modalFourId (index) {
      return 'modalFour' + index
    },
    modalFiveId (index) {
      return 'modalFive' + index
    },
    modalSixId (index) {
      return 'modalSix' + index
    },
    modalSevenId (index) {
      return 'modalSeven' + index
    },
    modalEightId (indexComment) {
      return 'modalEight' + indexComment
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
  .fa-comments{
    color: darkcyan;
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
  h1{
    font-size: 25px;
  }
  label, input{
    margin-bottom: 5%;
  }
</style>
