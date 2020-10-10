<template>
  <section class="d-flex flex-column container pb-5" id="accountParam">
    <h2 class="rounded-pill p-2 titleConfig mb-5 mt-4">Administrateur</h2>
    <div class="d-flex flex-column mt-md-3 col-12">
      <!--ADMIN PANEL IF USER IS ADMIN-->
      <article class="d-flex flex-column justify-content-around">
        <h3>Messages de la rubrique "Nous Contacter"</h3>

        <!--MODAL - GET USER ISSUES FROM "Nous Contacter"-->
        <b-button v-b-modal.allIssues @click="getIssues(), getPending()" variant="info" class="mr-auto ml-auto rounded-pill btnAdmin mb-3 mb-md-0">
          Voir les messages
          <b-badge variant="dark" pill v-if="messageWaiting.issues">{{messageWaiting.issues.length}} en attente</b-badge>
        </b-button>
        <b-modal id="allIssues" centered title="Messages" ok-only ok-title="Fermer">
          <b-tabs>

            <!--ALL MESSAGES-->
            <b-tab>
              <template v-slot:title>
                Tous les messages
              </template>
              <div v-if="allIssues.length > 0">
                <p class="text-center text-break mt-2">Total : {{ allIssues.length }} message(s)</p>
                <div v-for="(issue, index) in allIssues" :key="index" class="d-flex flex-column m-auto">
                  <b-list-group>

                    <!--TOGGLE - GET ISSUE-->
                    <b-list-group-item button id="showIssue" class="d-flex flex-md-row text-center flex-column m-auto" v-b-toggle="issueId(index)">
                      <h4 class="col-md-2">N°{{ allIssues[index].id }}</h4><br>
                      <!--USERS ISSUE'S STATUS-->
                      <p v-if="issue.status === 'pending'" class="d-flex col-md-6 justify-content-center pending">En attente de traitement</p>
                      <p v-else class="d-flex col-md-6 justify-content-center treated">Traité</p><br>
                      <p class="openBtn col-md-4">Ouvrir</p>
                    </b-list-group-item>
                    <b-collapse :id="'issueId' + index" class="mt-4">
                      <b-card>

                        <!--USERS ISSUES INFO-->
                        <p>Créé le : {{ issue.createdAt.split(' ')[0].split('-')[2] }}-{{ issue.createdAt.split(' ')[0].split('-')[1] }}-{{ issue.createdAt.split(' ')[0].split('-')[0] }} à {{ issue.createdAt.split(' ')[1].split(':')[0] }}h{{ issue.createdAt.split(':')[1].split(':')[0] }}</p>
                        <p>Prénom / Nom : {{ issue.firstName }} {{ issue.lastName }}</p>
                        <a :href="`mailto:${issue.email}`">Email: {{ issue.email }}</a>
                        <p>Sa / Ses question(s) : {{ issue.issue }}</p>
                        <p>Actuellement : <span v-if="issue.status === 'pending'" class="pending">En attente de traitement</span><span v-else class="treated">Traité</span></p>
                        <b-button class="d-flex mr-auto ml-auto mb-md-3" v-if="issue.status === 'pending'" pill variant="info" @click="updateIssue(index)">Mettre à jour le statut du message</b-button>
                        <b-button variant="danger" class="rounded-pill d-flex mr-auto ml-auto mb-md-3" v-if="issue.status === 'treated'" @click="deleteIssue(index)">Supprimer le message</b-button>
                      </b-card>
                    </b-collapse>
                  </b-list-group>
                </div>
              </div>

              <!--NO MESSAGE-->
              <div v-else class="d-flex col-12 align-items-center justify-content-center mt-3">Vous n'avez pas de message !</div>
            </b-tab>

            <!--MESSAGE WITH STATUS 'PENDING'-->
            <b-tab>
              <template v-slot:title>
                Messages en attente de traitement <b-badge pill variant='dark' class="badgeTab font-weight-normal" v-if="allPending.length > 0">{{allPending.length}}</b-badge>
              </template>
              <div v-if="allPending.length > 0">
                <div v-for="(pending, index) in allPending" :key="index" class="d-flex flex-column m-auto">

                  <!--TOGGLE - GET ISSUE 'PENDING'-->
                  <b-list-group>
                    <b-list-group-item button id="showPending" class="d-flex flex-md-row text-center flex-column m-auto" v-b-toggle="pendingId(index)">
                      <h4 class="col-md-2">N°{{ allPending[index].id }}</h4><br>
                      <p class="d-flex col-md-6 justify-content-center pending">En attente de traitement</p>
                      <p class="openBtn col-md-4">Ouvrir</p>
                    </b-list-group-item>
                    <b-collapse :id="'pendingId' + index" class="mt-4">
                      <b-card>

                        <!--USERS ISSUES INFO-->
                        <p>Créé le : {{ pending.createdAt.split(' ')[0].split('-')[2] }}-{{ pending.createdAt.split(' ')[0].split('-')[1] }}-{{ pending.createdAt.split(' ')[0].split('-')[0] }} à {{ pending.createdAt.split(' ')[1].split(':')[0] }}h{{ pending.createdAt.split(':')[1].split(':')[0] }}</p>
                        <p>Prénom / Nom : {{ pending.firstName }} {{ pending.lastName }}</p>
                        <a :href="`mailto:${pending.email}`">Email: {{ pending.email }}</a>
                        <p>Sa / Ses question(s) : {{ pending.issue }}</p>
                        <p>Actuellement : <span class="pending">En attente de traitement</span></p>
                        <b-button class="d-flex m-auto" pill variant="info" @click="updateIssue(index)">Mettre à jour le statut du message</b-button>
                      </b-card>
                    </b-collapse>
                  </b-list-group>
                </div>
              </div>

              <!--NO MESSAGE WITH STATUS 'PENDING'-->
              <div v-else class="d-flex col-12 align-items-center justify-content-center mt-3">Vous n'avez pas de message en attente de traitement !</div>
            </b-tab>
          </b-tabs>
        </b-modal>
      </article>

      <!--MODAL - GET REPORTS-->
      <article class="mt-md-5">
        <h3>Signalements de contenu</h3>
        <b-button v-b-modal.allReports @click="getAllReports(), isClicked = true" variant="info" class="mb-3 mb-md-0 rounded-pill btnAdmin">
          Voir les signalements
          <b-badge variant="dark" pill v-if="messageWaiting.postReports && messageWaiting.commentReports">{{messageWaiting.postReports.length + messageWaiting.commentReports.length}} en attente</b-badge>
        </b-button>
        <b-modal ok-only centered @ok="getUserPosts" @close="getUserPosts" title="Signalements" id="allReports" v-if="isClicked">
          <b-tabs>
            <!--POSTS REPORTS-->
            <b-tab>
              <template v-slot:title>
                Posts <b-badge variant='dark' pill class="badgeTab font-weight-normal" v-if="messageWaiting.postReports.length > 0">{{ messageWaiting.postReports.length }}</b-badge>
              </template>
              <div v-if="allReports.postReports.length > 0">
                <p class="text-center text-break mt-2">Total : {{allReports.postReports.length}} signalement(s) de post(s)</p>
                <div v-for="(postReport, index) in allReports.postReports" :key="index">
                  <b-list-group>

                    <!--TOGGLE - GET REPORT-->
                    <b-list-group-item button class="d-flex flex-column text-center flex-md-row m-auto" v-b-toggle="reportPostId(index)" @click="getUserInfo(index), getPost(index)">
                      <h4 class="col-md-2">N°{{ allReports.postReports[index].id }}</h4><br>

                      <!--POSTS REPORTS STATUS-->
                      <p class="d-flex col-md-6 justify-content-center pending" v-if="allReports.postReports[index].status === 'pending'">En attente de traitement</p>
                      <p v-else class="d-flex col-md-6 justify-content-center treated">Traité</p>
                      <p class="openBtn col-md-4">Ouvrir</p>
                    </b-list-group-item>
                    <b-collapse :id="'reportPostId' + index" class="mt-4">
                      <b-card class="d-flex flex-column m-auto">
                        <div class="border p-0 p-md-2">
                          <!--POST REPORT INFO-->
                          <p>Créé le : {{ postReport.createdAt.split(' ')[0].split('-')[2] }}-{{ postReport.createdAt.split(' ')[0].split('-')[1] }}-{{ postReport.createdAt.split(' ')[0].split('-')[0] }} à {{ postReport.createdAt.split(' ')[1].split(':')[0] }}h{{ postReport.createdAt.split(':')[1].split(':')[0] }}</p>
                          <p class="mt-3"><span class="pending">Signalement : </span>{{ postReport.report }}</p>

                          <!--TOGGLE - REPORT AUTHOR INFO-->
                          <b-button class="d-flex btnUserReport" v-b-toggle="userId(index)" variant="info">Infos de l'utilisateur</b-button>
                          <b-collapse :id="'user' + index">
                            <div class="userComment d-flex flex-column flex-md-row align-items-center justify-content-md-center mb-5 mt-3">
                              <!--LINK TO AUTHOR PROFILE-->
                              <router-link :to="`/profile/${userInfo.id}`"><img :src="userInfo.profile_picture" :alt="userInfo.alt_picture" class="imgComment"/></router-link>
                              <h5>{{ userInfo.username}}</h5>
                            </div>
                          </b-collapse>

                          <!--POST PREVIEW-->
                          <b-button class="d-flex btnUserReport" v-b-toggle="postId(index)" variant="info">Aperçu du post</b-button>
                          <b-collapse :id="'post' + index" class="mt-3 mb-5">
                            <div class="d-flex formPart text-center flex-column col-md-10 m-auto text-break">
                              <h4>{{ postInfo.title }}</h4>
                              <p>{{ postInfo.content }}</p>
                              <img :src="postInfo.url_gif" :alt="postInfo.alt_gif" class="d-flex mr-auto ml-auto img-fluid imgPosts mt-md-3 mb-3"/>
                            </div>
                          </b-collapse>
                        </div>
                        <div>

                          <!--REPORTED POST OPTIONS-->
                          <div class="d-flex flex-column border p-2">
                            <h5 class="col-12 text-center">Options pour le post</h5>
                            <div class="accordion" role="tablist">
                              <b-card no-body class="mb-1">

                                <!--EDIT REPORTED POST-->
                                <b-card-header header-tag="header" class="p-0" role="tab">
                                  <b-button block v-b-toggle.accordion-1 variant="primary" @click="setPostValue(index)">Editer le post signalé</b-button>
                                </b-card-header>
                                <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel" >
                                  <b-card-body>
                                    <b-form enctype="multipart/form-data">
                                      <b-form-group
                                      label="Titre du post :"
                                      label-for="titleUpdate"
                                      class="text-center mt-3">
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
                                                class="postInput text-center"
                                                rows="3"
                                                max-rows="6"
                                                :state="statePostContent"
                                        >{{ userPost.content }}</b-form-textarea>
                                        <b-form-invalid-feedback>
                                          Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                                        </b-form-invalid-feedback>
                                      </b-form-group>
                                        <b-button v-b-modal.emojisAdmin class="mt-2 rounded-pill d-flex mr-auto ml-auto mb-md-2" variant="dark">😃 Ajouter des emoticones !</b-button>
                                        <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisAdmin" triggers="hover" placement="top">
                                          <div class="d-flex row m-2">
                                            <p v-for="(emoji, index) in emojis" :key="index" @click="getEmoji(index)">{{ emoji }}</p>
                                          </div>
                                        </b-modal>
                                        <div id="postUpdate" class="mt-3">
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
                                        <b-button type="submit" @click.prevent="updatePost(index)" class="d-flex rounded-pill commentBtn">Modifier</b-button>
                                    </b-form>
                                  </b-card-body>
                                </b-collapse>
                              </b-card>

                              <!--DELETE REPORTED POST-->
                              <b-button block v-b-toggle.accordion-2 variant="danger" @click="showDeleteToggle = true">Supprimer le post signalé</b-button>
                              <b-collapse id="accordion-2" v-if="showDeleteToggle === true">
                                <p class="text-center mt-md-2">Êtes-vous sûr(e) de vouloir supprimer ce post ?</p>
                                <div class="d-flex flex-column flex-md-row m-auto justify-content-md-center align-items-md-center">
                                  <b-button @click="showDeleteToggle = false" variant="info" class="d-flex mr-auto ml-auto mb-3 mb-md-0 rounded-pill">Annuler</b-button>
                                  <b-button variant="danger" @click="deletePost(index)" class="d-flex mr-auto ml-auto rounded-pill">Supprimer</b-button>
                                </div>
                              </b-collapse>
                            </div>
                          </div>

                          <!--REPORT OPTIONS-->
                          <div class="d-flex flex-column border p-2">
                            <h5 class="col-12 text-center">Option(s) pour le signalement</h5>
                            <!--UPDATE REPORT STATUS TO 'TREATED"-->
                            <b-button class="btnUserReport" variant="success" @click="updatePostReport(index)" v-if="postReport.status.includes('pending')">Mettre à jour le signalement</b-button>
                            <!--DELETE REPORT-->
                            <b-button v-else variant="warning" @click="deletePostReport(index)">Supprimer le signalement</b-button>
                          </div>
                        </div>
                      </b-card>
                    </b-collapse>
                  </b-list-group>
                </div>
              </div>
              <!--NO REPORTED POST-->
              <div v-else class="d-flex col-12 align-items-center justify-content-center mt-3">Aucun post n'a été signalé !</div>
            </b-tab>

            <!--COMMENTS REPORTS-->
            <b-tab>
              <template v-slot:title>
                Commentaires <b-badge variant='dark' class="badgeTab font-weight-normal" pill v-if="messageWaiting.commentReports.length > 0">{{ messageWaiting.commentReports.length }}</b-badge>
              </template>
              <div v-if="allReports.commentReports.length > 0">
                <p class="text-center text-break mt-2">Total : {{allReports.commentReports.length }} signalement(s) de commentaire</p>
                <div v-for="(commentReport, indexComment) in allReports.commentReports" :key="indexComment">
                  <b-list-group>

                    <!--TOGGLE - GET REPORT-->
                    <b-list-group-item button class="d-flex m-auto text-center flex-column flex-md-row" v-b-toggle="reportCommentId(indexComment)" @click="getUserInfoComment(indexComment), getComment(indexComment)">
                      <h4 class="col-md-2">N°{{ allReports.commentReports[indexComment].id }}</h4><br>
                      <!--COMMENTS REPORTS STATUS-->
                      <p class="d-flex col-md-6 justify-content-center pending" v-if="allReports.commentReports[indexComment].status === 'pending'">En attente de traitement</p>
                      <p v-else class="d-flex col-md-6 justify-content-center treated">Traité</p>
                      <p class="openBtn col-md-4">Ouvrir</p>
                    </b-list-group-item>
                    <b-collapse :id="'reportCommentId' + indexComment" class="mt-4">
                      <b-card class="d-flex flex-column m-auto">
                        <div class="border p-md-2">
                          <!--COMMENTS REPORTS INFO-->
                          <p>Créé le : {{ commentReport.createdAt.split(' ')[0].split('-')[2] }}-{{ commentReport.createdAt.split(' ')[0].split('-')[1] }}-{{ commentReport.createdAt.split(' ')[0].split('-')[0] }} à {{ commentReport.createdAt.split(' ')[1].split(':')[0] }}h{{ commentReport.createdAt.split(':')[1].split(':')[0] }}</p>
                          <p class="mt-3"><span class="pending">Signalement : </span>{{ commentReport.report }}</p>

                          <!--TOGGLE - REPORT AUTHOR INFO-->
                          <b-button class="d-flex btnUserReport" v-b-toggle="userId(indexComment)" variant="info">Infos de l'utilisateur</b-button>
                          <b-collapse :id="'user' + indexComment">
                            <div class="userComment d-flex flex-column flex-md-row justify-content-md-center align-items-center mb-5 mt-3">
                              <!--LINK TO AUTHOR PROFILE-->
                              <router-link :to="`/profile/${userInfo.id}`" class="d-flex mr-2"><img :src="userInfo.profile_picture" :alt="userInfo.alt_picture" class="imgComment"/></router-link>
                              <h5>{{ userInfo.username}}</h5>
                            </div>
                          </b-collapse>

                          <!--COMMENT PREVIEW-->
                          <b-button class="d-flex btnUserReport" v-b-toggle="commentId(indexComment)" variant="info">Aperçu du commentaire</b-button>
                          <b-collapse :id="'comment' + indexComment" class="mt-3 mb-5">
                            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center text-center comment p-md-2 ml-0 mr-0 ml-md-2 mr-md-2 mb-3">
                              <div class="userComment d-flex flex-column pt-3">
                                <router-link :to="`/profile/${comment.author.id}`"><img :src="comment.author.url_profile_picture" :alt="comment.author.alt_profile_picture" class="imgComment"/></router-link>
                                <h4>{{ comment.author.username}}</h4>
                              </div>
                              <div class="commentText pb-3 col-md-8">{{ comment.infos.comment }}</div>
                            </div>

                            <!--SIDEBAR - GET COMMENT CONTEXT - POST CONTAINING REPORTED COMMENT + ALL COMMENTS-->
                            <b-button v-b-toggle.sidebar-1 class="rounded-pill d-flex m-auto" variant="info" @click="getContext(indexComment)">Voir le post et les autres commentaires</b-button>
                            <b-sidebar id="sidebar-1" title="Aperçu post/commentaires">
                              <div class="d-flex m-auto flex-column align-items-center p-md-2">
                                <h3 class="border-bottom mb-3">Post</h3>
                                <div class="d-flex formPart flex-column align-items-center">
                                  <!--POST CONTAINING REPORTED COMMENT-->
                                  <h4>{{ context.post.title }}</h4>
                                  <p>{{ context.post.content }}</p>
                                  <img :src="context.post.url_gif" :alt="context.post.alt_gif" class="img-fluid imgPosts"/>
                                </div>
                              </div>
                              <div class="d-flex m-auto flex-column align-items-center p-md-2">
                                <!--ALL POST'S COMMENTS-->
                                <h3 class="border-bottom mt-3 mb-3">Commentaire(s)</h3>
                                <div class="d-flex flex-column flex-md-row col-12 p-2 text-center justify-content-md-between align-items-center comment ml-0 mr-0 mb-3" v-for="(contextComment, indexComment) in context.comments" :key="indexComment">
                                  <div class="userComment d-flex flex-column">
                                    <router-link :to="`/profile/${contextComment.User.id}`"><img :src="contextComment.User.url_profile_picture" :alt="contextComment.User.alt_profile_picture" class="imgComment"/></router-link>
                                    <h4>{{ contextComment.User.username}}</h4>
                                  </div>
                                  <div class="commentText col-md-8">{{ contextComment.comment }}</div>
                                </div>
                              </div>
                            </b-sidebar>
                          </b-collapse>
                        </div>
                        <div>

                          <!--REPORTED COMMENT OPTIONS-->
                          <div class="d-flex flex-column border p-2">
                            <h5 class="col-12 text-center">Options pour le commentaire</h5>
                            <div class="accordion" role="tablist">
                              <b-card no-body class="mb-1">

                                <!--EDIT REPORTED COMMENT-->
                                <b-card-header header-tag="header" class="p-0" role="tab">
                                  <b-button block v-b-toggle.accordion-4 variant="primary">Editer le commentaire signalé</b-button>
                                </b-card-header>
                                <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel" >
                                  <b-card-body>
                                    <b-form enctype="multipart/form-data">
                                      <b-form-group
                                      label="Contenu du commentaire :"
                                      label-for="commentUpdate"
                                      class="text-center mt-3">
                                        <b-form-textarea
                                                id="commentUpdate"
                                                v-model="comment.infos.comment"
                                                required
                                                class="postInput text-center"
                                                rows="3"
                                                max-rows="6"
                                                :state="stateComment"
                                        >{{ comment.infos.comment }}</b-form-textarea>
                                        <b-form-invalid-feedback>
                                          Champ requis, merci de ne pas utiliser les caractères : <img src="../assets/img/symbols.png" alt="symbols" class="img-fluid">
                                        </b-form-invalid-feedback>
                                      </b-form-group>
                                      <b-button v-b-modal.emojisCommentAdmin class="mt-2 rounded-pill d-flex mr-auto ml-auto" variant="dark">😃 Ajouter des emoticones !</b-button>
                                      <b-modal centered title="Emoticones" ok-only ok-title="Fermer" ok-variant="info" id="emojisCommentAdmin" triggers="hover" placement="top">
                                        <div class="d-flex row m-2">
                                          <p v-for="(emoji, index) in emojis" :key="index" @click="getEmojiComment(index)">{{ emoji }}</p>
                                        </div>
                                      </b-modal>
                                      <b-button type="submit" @click.prevent="updateComment(indexComment)" class="d-flex rounded-pill commentBtn">Modifier</b-button>
                                    </b-form>
                                  </b-card-body>
                                </b-collapse>
                              </b-card>

                              <!--DELETE REPORTED COMMENT-->
                              <b-button block v-b-toggle.accordion-2 variant="danger" @click="showDeleteToggle = true">Supprimer le commentaire signalé</b-button>
                              <b-collapse id="accordion-2" v-if="showDeleteToggle === true">
                                <p class="text-center mt-3">Êtes-vous sûr(e) de vouloir supprimer ce commentaire ?</p>
                                <div class="d-flex flex-column flex-md-row justify-content-md-center align-items-center">
                                  <b-button @click="showDeleteToggle = false" variant="info" class="d-flex rounded-pill mb-3 mb-md-0 mr-auto ml-auto">Annuler</b-button>
                                  <b-button @click="deleteComment(indexComment)" variant="danger" class="d-flex rounded-pill mr-auto ml-auto">Supprimer</b-button>
                                </div>
                              </b-collapse>
                            </div>
                          </div>

                          <!--REPORTS OPTIONS-->
                          <div class="d-flex flex-column border p-2">
                            <h5 class="col-12 text-center">Option(s) pour le signalement</h5>
                            <!--UPDATE REPORT STATUS TO 'TREATED'-->
                            <b-button class="btnUserReport" variant="success" @click="updateCommentReport(indexComment)" v-if="commentReport.status.includes('pending')">Mettre à jour le signalement</b-button>
                            <!--DELETE REPORT-->
                            <b-button v-else variant="warning" @click="deleteCommentReport(indexComment)">Supprimer le signalement</b-button>
                          </div>
                        </div>
                      </b-card>
                    </b-collapse>
                  </b-list-group>
                </div>
              </div>
              <!--NO REPORTED COMMENT-->
              <div v-else class="d-flex col-12 align-items-center justify-content-center mt-3">Aucun commentaire n'a été signalé !</div>
            </b-tab>
          </b-tabs>
        </b-modal>
      </article>

      <!--ALL USERS-->
      <article class="mt-md-5">
        <h3>Utilisateurs</h3>
        <b-button @click="getAllUsers" v-b-modal.allUsers class="rounded-pill btnAdmin" variant="info">
          Voir tous les utilisateurs
          <b-badge variant="dark" pill>Total : {{allUsers.length}}</b-badge>
        </b-button>

        <!--MODAL - GET ALL USERS + USER RESEARCH-->
        <b-modal ok-only ok-title="Fermer" centered ok-variant="warning" id="allUsers" title="Tous les utilisateurs" @hidden="clearResearch">
          <div id="searchBarBg" class="d-flex flex-column">
            <div class="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <b-form-input placeholder="Rechercher un utilisateur" id="barSearch" v-model="userResearch" class="col-md-9 col-lg-8 mt-md-1 mb-md-1" @keyup="research()"></b-form-input>
              <b-button id="btnSearch" type="submit" @click.prevent="research()" class="col-md-2"><i class="fas fa-search"></i></b-button>
            </div>
            <div v-if="userResearch.length > 0" class="text-center mt-2">Résultat de la recherche : {{ userResult.length }} utilisateur(s) correspond(ent)</div>
          </div>
          <div>
            <div v-if="userResearch.length > 0" class="d-flex flex-column">
              <div v-if="userResult.length === 0" class="text-center mt-2">Oups ! Pas de correspondance pour "{{ userResearch }}"</div>
              <div v-else class="my-2 my-md-4 d-flex p-md-2 flex-column flex-md-row align-items-center justify-content-center" v-for="user in userResult" :key="user.id" id="userResearch">
                <router-link :to="`/profile/${user.id}`"><img :src="user.url_profile_picture" class=" d-flex imgResearch"/></router-link>
                <h4 class="d-flex text-center text-break col-8">{{ user.username }}</h4>
              </div>
            </div>
          </div>
          <div v-if="userResearch.length === 0">
            <div class="my-4 d-flex p-md-2 flex-column flex-md-row align-items-center justify-content-center" v-for="user in allUsers" :key="user.id">
              <router-link :to="`/profile/${user.id}`">
                <img :src="user.url_profile_picture" :alt="user.alt_profile_picture" class="imgComment"/>
              </router-link>
              <h4 class="d-flex col-md-9 justify-content-center text-center">{{ user.username }}</h4>
            </div>
          </div>
        </b-modal>
      </article>
    </div>
  </section>
</template>
<script>
export default {
  name: 'accountAdmin',
  data () {
    return {
      userResearch: '',
      userResult: '',
      allUsers: '',
      allIssues: '',
      allPending: '',
      emojis: this.$store.state.posts.emojis,
      allReports: {
        postReports: '',
        commentReports: ''
      },
      allReportsPending: '',
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
      userComment: {
        comment: ''
      },
      comment: {
        infos: '',
        author: ''
      },
      context: {
        post: '',
        comments: ''
      },
      url: '',
      file: null,
      isClicked: false,
      showToggle: false,
      showDeleteToggle: false
    }
  },
  computed: {
    messageWaiting () {
      return this.$store.state.issues.messageWaiting
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
    stateComment () {
      // eslint-disable-next-line no-useless-escape
      let regex = new RegExp(/[\|\/\\\*\+&#\{\(\[\]\}\)<>$£€%=\^`]/g)
      if(this.comment.infos.comment && this.comment.infos.comment.length > 0 && !regex.test(this.comment.infos.comment)){
        return true
      } else if(this.comment.infos.comment && this.comment.infos.comment.length > 0 && regex.test(this.comment.infos.comment) || regex.test(this.comment.infos.comment)) {
        return false
      } else {
        return null
      }
    }
  },
  methods: {
    //ALL REPORTS
    getAllReports () {
      this.$store.dispatch('readAllReports')
              .then(response => {
                this.allReports.postReports = response.data.postReports
                this.allReports.commentReports = response.data.commentReports
              })
    },
    getUserPosts () {
      this.$store.dispatch('posts/getAllPostsFromOneUser', this.$route.params.id)
    },

    //POSTS REPORTS
    updatePostReport (index) {
      let id = this.allReports.postReports[index].id
      this.$store.dispatch('updatePostReport', id)
              .then(() => {
                this.showAlertSuccess('Le signalement a été mis à jour !', '2000')
                this.getAllReports()
                this.$store.dispatch('messageWaiting')
              })
    },
    deletePostReport (index) {
      let id = this.allReports.postReports[index].id
      this.$store.dispatch('deleteOnePostReport', id)
              .then(() => {
                this.showAlertSuccess('Signalement supprimé', '1500')
                this.getAllReports()
                this.$store.dispatch('messageWaiting')
              })
    },
    getUserInfo (index) {
      let userId = this.allReports.postReports[index].UserId
      this.$store.dispatch('user/getOneUser', userId)
              .then((response) => {
                this.userInfo.id = response.data.id
                this.userInfo.username = response.data.username
                this.userInfo.profile_picture = response.data.url_profile_picture
                this.userInfo.alt_picture = response.data.alt_profile_picture
              })
    },

    //POSTS OPTIONS
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
    onFileChanged (e) {
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      const file = e.target.files[0]
      if (!authorizedFile.includes(file.name.split('.')[1])) {
        this.url = 'http://localhost:3000/images/wrongExtension.png'
      } else {
        this.url = URL.createObjectURL(file)
      }
    },
    getPost (index) {
      let postId = this.allReports.postReports[index].PostId
      this.$store.dispatch('posts/getOnePost', postId)
              .then(response => {
                this.postInfo = response.data
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
      let authorizedFile = ['jpg', 'jpeg', 'gif', 'png']
      if(this.statePostTitle !== true || this.statePostContent !== true || this.file !== null && !authorizedFile.includes(this.file.name.split('.')[1])){
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let postId = this.allReports.postReports[index].PostId
        let formData = new FormData()
        formData.append('title', this.userPost.title.toString())
        formData.append('content', this.userPost.content.toString())
        formData.append('image', this.file)
        let payload = {
          id: postId,
          data: formData
        }
        document.getElementById('accordion-1').classList.remove('show')
        this.$store.dispatch('posts/updatePost', payload)
                .then(() => {
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
      }
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
    },

    //COMMENTS REPORTS
    updateCommentReport (indexComment) {
      let id = this.allReports.commentReports[indexComment].id
      this.$store.dispatch('updateCommentReport', id)
              .then(() => {
                this.showAlertSuccess('Le signalement a été mis à jour !', '2000')
                this.getAllReports()
                this.$store.dispatch('messageWaiting')
              })
    },
    deleteCommentReport (indexComment) {
      let id = this.allReports.commentReports[indexComment].id
      this.$store.dispatch('deleteOneCommentReport', id)
              .then(() => {
                this.showAlertSuccess('Signalement supprimé', '1500')
                this.getAllReports()
                this.$store.dispatch('messageWaiting')
              })
    },
    getUserInfoComment (indexComment) {
      let userId = this.allReports.commentReports[indexComment].UserId
      this.$store.dispatch('user/getOneUser', userId)
              .then((response) => {
                this.userInfo.id = response.data.id
                this.userInfo.username = response.data.username
                this.userInfo.profile_picture = response.data.url_profile_picture
                this.userInfo.alt_picture = response.data.alt_profile_picture
              })
    },

    //COMMENTS OPTIONS
    getEmojiComment (index) {
      let emojiCode = this.emojis[index]
      if(this.comment.infos.comment === null) {
        this.comment.infos.comment = emojiCode
      } else {
        this.comment.infos.comment += emojiCode
      }
      this.$swal({
        title: '',
        timer: '1000',
        text: '✔ Ajouté !️',
        showConfirmButton: false
      })
    },
    getComment (indexComment) {
      let payload = {
        id: this.allReports.commentReports[indexComment].PostId,
        commentId: this.allReports.commentReports[indexComment].CommentId
      }
      this.$store.dispatch('posts/getOneComment', payload)
              .then(response => {
                console.log(response.data)
                this.comment.infos = response.data
                this.$store.dispatch('user/getOneUser', this.comment.infos.user_id)
                        .then(user => {
                          this.comment.author = user.data
                        })
              })
    },
    getContext (indexComment) {
      let postId = this.allReports.commentReports[indexComment].PostId
      this.$store.dispatch('posts/getOnePost', postId)
              .then(response => {
                this.context.post = response.data
                this.$store.dispatch('posts/getComments', postId)
                        .then(comments => {
                          this.context.comments = comments.data
                        })
              })
    },
    updateComment (indexComment) {
      if (this.comment.infos.comment === 0 || this.stateComment !== true) {
        this.showAlertError('Merci de renseigner les différents champs au bon format', '1500')
      } else {
        let postId = this.allReports.commentReports[indexComment].PostId
        let payload = {
          id: postId,
          commentId: this.allReports.commentReports[indexComment].CommentId,
          newComment: {
            comment: this.comment.infos.comment.toString()
          }
        }
        document.getElementById('accordion-4').classList.remove('show')
        this.$store.dispatch('posts/updateComment', payload)
                .then(() => {
                  this.showAlertSuccess('Commentaire modifié !', '1500')
                  this.getComment(indexComment)
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
    deleteComment (indexComment) {
      let payload = {
        id: this.allReports.commentReports[indexComment].PostId,
        commentId: this.allReports.commentReports[indexComment].CommentId
      }
      this.$store.dispatch('posts/deleteComment', payload)
              .then(() => {
                this.showAlertSuccess('Ce commentaire et son signalement ont été supprimés !', '3500')
                this.isClicked = false
                this.getAllReports()
                this.isClicked = true
                this.$store.dispatch('messageWaiting')
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

    //USERS
    getAllUsers () {
      this.$store.dispatch('user/getAllUser')
              .then(response => {
                this.allUsers = response.data
                console.log(this.allUsers)
              })
    },

    //ISSUES
    getIssues () {
      this.$store.dispatch('readAllIssues')
              .then(response => {
                this.allIssues = response.data
              })
    },
    getPending () {
      this.$store.dispatch('readAllPending')
              .then(response => {
                if (!response.data.message) {
                  this.allPending = response.data
                } else {
                  this.allPending = ''
                }

              })
    },
    updateIssue (index) {
      let issueId = this.allIssues[index].id
      this.$store.dispatch('updateIssue', issueId)
              .then(() => {
                this.getIssues()
                this.getPending()
                this.$store.dispatch("messageWaiting")
              })
    },
    deleteIssue (index) {
      this.$store.dispatch('deleteIssue', this.allIssues[index].id)
              .then(() => {
                this.showAlertSuccess('Message supprimé !', '1500')
                this.getIssues()
                this.getPending()
                this.$store.dispatch('messageWaiting')
              })
    },

    //RESEARCH
    clearResearch () {
      this.showModal = false
      this.userResearch = ''
      this.userResult = ''
    },
    research () {
      if(this.userResearch.length !== 0){
        // eslint-disable-next-line no-useless-escape
        let regex = new RegExp(/['\|\/\\\*\+&#"\{\(\[\]\}\)<>$£€%=\^`]/g)
        let newResearch = ''
        let data = {
          research: null
        }
        if (regex.test(this.userResearch)) {
          newResearch = this.userResearch.replace(regex, '')
        }
        if (newResearch.length !== 0) {
          data.research = newResearch.toString()
        } else {
          data.research = this.userResearch.toString()
        }
        this.showModal = true
        this.$store.dispatch('researchUser', data)
                .then(() => {
                  this.userResult = this.$store.state.research.resultResearch
                }).catch(error => {
          if (error.message.split('code ')[1].includes('500')) {
            this.showAlertError(`Oups ! Quelque chose s'est mal passé ! Si cela se reproduit, merci de nous contacter via la rubrique "Nous contacter" !`, '3500')
          } else if (error.message.split('code ')[1].includes('400')) {
            this.showAlertError(`Merci de renseigner un nom avant de cliquer sur le bouton de recherche`, '4000')
          }
        })
      }
    },

    //MODALS + ALERTS
    issueId (index) {
      return 'issueId' + index
    },
    pendingId (index) {
      return 'pendingId' + index
    },
    reportPostId (index) {
      return 'reportPostId' + index
    },
    reportCommentId (indexComment) {
      return 'reportCommentId' + indexComment
    },
    postId (index) {
      return 'post' + index
    },
    commentId (indexComment) {
      return 'comment' + indexComment
    },
    userId (index) {
      return 'user' + index
    },
    showAlertSuccess (title, timer) {
      this.$swal({
        title: title,
        position: 'center',
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
    }
  },
  beforeCreate () {
    if (!this.$cookies.isKey('user')) {
      this.$router.push({name: 'auth'})
    } else {
      this.$store.dispatch('user/getCurrentUser')
        .then(() => {
          if (!this.$store.state.user.currentUser.infos.role.includes('admin')){
            this.$router.push({name: 'wall'})
              .then(() => {
                this.showAlertError(`Vous n'avez pas les droits nécessaires pour accéder à cette page !`, '3500')
              })
          } else {
            this.$store.dispatch('user/getAllUser')
                    .then(response => {
                      this.allUsers = response.data
                      this.$store.dispatch('messageWaiting')
                    })
          }
        })
    }
  }
}
</script>
<style scoped>
  .imgResearch{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 4px solid #2C3F5F;
    box-shadow: 0 0 6px black;
  }
  .btnUserReport{
    margin: 3% auto;
  }
  .btnAdmin{
    box-shadow: 0 0 6px black;
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
    background-color: white;
  }
  h3{
    font-size: 20px;
  }
  .titleConfig{
    border: 2px solid #2C3F5F;
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  .card-body{
    padding: 0;
  }
  .btn .badge{
    font-size: 1em;
    font-weight: normal;
    letter-spacing: 1px;
    top: -15px;
    right: -10px;
    box-shadow: 0 0 4px white;
  }
  #barSearch{
    box-shadow: 0 0 6px black;
    color: #2C3F5F;
  }
  #btnSearch{
    background-color: #2C3F5F;
    color: white;
    box-shadow: 0 0 6px black;
  }
  #btnSearch:hover{
    background-color: #0762a3;
  }
  .badgeTab{
    font-size: 1em;
    letter-spacing: 1px;
    font-family: "Berlin Sans FB";
  }
  @media screen and (max-width: 567px){
    .btn .badge{
      top: 0;
      right: 0;
    }
  }
  @media screen and (min-width: 768px){
    #searchBarBg{
      padding: 2%;
      border: 4px double #2C3F5F;
      border-radius: 50px 0;
      background-color: rgba(176, 230, 255, 0.5);
      box-shadow: 0 0 3px black;
    }
  }
</style>
