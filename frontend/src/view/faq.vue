<template>
  <div id="faq">
    <!--FAQ VIEW-->
    <h1>Bienvenue sur notre section Foire aux Questions !</h1>
    <h2>Quel est votre problème ?</h2>
    <div class="d-flex align-items-center justify-content-center col-xl-7 m-md-auto">
      <b-tabs content-class="mt-3" id="tab2" class="col-12" align="center">

        <!--LOGIN/SIGNUP ISSUES-->
        <b-tab title="M'inscrire/Me connecter">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO SIGNUP ?-->
                <b-button block v-b-toggle.accordion-1 variant="info">Comment m'inscrire ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour vous inscrire, rendez-vous sur <router-link :to="{name: 'auth'}">la page d'accueil</router-link>
                    cliquez sur l'onglet "Inscription" :<br>
                    <img src="../assets/img/signup.png" alt="inscription" class="img-fluid"/><br>
                    puis renseignez les différents champs concernant votre email, mot de passe, nom d'utilisateur,
                    parlez un peu de vous dans le champ "Bio", choisissez une photo de profil (si vous n'en choisissez pas, une photo par défaut vous sera
                    assignée) puis cliquez sur "Inscription" et le tour est joué !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO LOGIN ?-->
                <b-button block v-b-toggle.accordion-2 variant="info">Comment me connecter ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour vous connecter, rendez-vous sur <router-link :to="{name: 'auth'}">la page d'accueil</router-link>
                    cliquez sur l'onglet "Connexion" : <br>
                    <img src="../assets/img/Connexion.png" alt="connexion" class="img-fluid"/><br>
                    puis renseignez l'email utilisé lors de l'inscription ainsi que votre mot de passe,
                    cliquez sur "Connexion" et le tour est joué !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--POSTS ISSUES-->
        <b-tab title="Posts">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO PUBLISH POST ?-->
                <b-button block v-b-toggle.accordion-3 variant="info">Comment publier un post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Une fois connecté, vous trouverez une partie "Voulez-vous partager quelque chose ?" :<br>
                    <img src="../assets/img/post.png" alt="how to post" class="img-fluid"/><br>
                    Indiquez un titre, le texte que vous souhaitez partagez, choisissez un fichier image (.jpg, .jpeg, .gif, .png uniquement) puis
                    cliquez sur "Publier" et votre post est publié !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO EDIT POST ?-->
                <b-button block v-b-toggle.accordion-4 variant="info">Comment modifier mon post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous êtes bien l'auteur du post, vous devriez voir une icône "Modifier le Post" :<br>
                    <i class="far fa-edit"><span>Modifier le Post</span></i><br>
                    Cliquez dessus, modifiez ce que vous souhaitez puis valider en cliquant sur "Modifier" !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DELETE POST ?-->
                <b-button block v-b-toggle.accordion-5 variant="info">Comment supprimer mon post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-5" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous êtes bien l'auteur du post, vous devriez voir une icône "Supprimer le post" :<br>
                    <i class="fas fa-trash-alt"><span> Supprimer le post</span></i><br>
                    Cliquez dessus, validez votre choix en cliquant sur "Supprimer" et votre post est supprimé !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO REPORT POST-->
                <b-button block v-b-toggle.accordion-6 variant="info">Comment signaler un post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-6" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous rencontrez le moindre problème avec un post (propos, image partagée, etc.) n'hésitez pas
                    à signaler le post en cliquant sur l'icône Drapeau rouge :<br>
                    <i class="far fa-flag"></i><br>
                    Indiquez nous ce qui vous pose problème, cliquez sur "Envoyer" et nous traiterons votre demande dans les plus brefs délais !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--COMMENTS ISSUES-->
        <b-tab title="Commentaires">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO COMMENT ?-->
                <b-button block v-b-toggle.accordion-7 variant="info">Comment commenter une publication ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-7" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Sous l'image du post que vous souhaitez commenter vous trouverez l'icône commentaire :<br>
                    <i class="far fa-comments"></i><br>
                    Cliquez dessus, puis sur "Ajouter un commentaire", saisissez votre commentaire et cliquez sur "Commenter" !<br>
                    Si vous avez déjà commenté un post, l'icône des commentaires sera :<br>
                    <i class="fas fa-comments"></i>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO EDIT COMMENT ?-->
                <b-button block v-b-toggle.accordion-8 variant="info">Comment modifier mon commentaire ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-8" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous êtes bien l'auteur du commentaire, vous devriez voir une icône "Modifier le commentaire" :<br>
                    <i class="far fa-edit"><span>Modifier le commentaire</span></i><br>
                    Cliquez dessus, modifiez ce que vous souhaitez puis valider en cliquant sur "Modifier" !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DELETE COMMENT ?-->
                <b-button block v-b-toggle.accordion-9 variant="info">Comment supprimer mon commentaire ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-9" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous êtes bien l'auteur du commentaire, vous devriez voir une icône "Supprimer le commentaire" :<br>
                    <i class="fas fa-trash-alt"><span> Supprimer le commentaire</span></i><br>
                    Cliquez dessus, validez votre choix en cliquant sur "Supprimer" et votre commentaire est supprimé !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO REPORT COMMENT ?-->
                <b-button block v-b-toggle.accordion-10 variant="info">Comment signaler un commentaire ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-10" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Si vous rencontrez le moindre problème avec un commentaire (propos, image partagée, etc.) n'hésitez pas
                    à signaler le post en cliquant sur l'icône Drapeau rouge placé au-dessus du commentaire concerné :<br>
                    <i class="far fa-flag"></i><br>
                    Indiquez nous ce qui vous pose problème, cliquez sur "Envoyer" et nous traiterons votre demande dans les plus brefs délais !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--LIKES ISSUES-->
        <b-tab title="Likes">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO LIKE A POST ?-->
                <b-button block v-b-toggle.accordion-11 variant="info">Comment liker un post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-11" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Sous l'image du post que vous souhaitez liker vous trouverez l'icône like :<br>
                    <i class="far fa-thumbs-up"></i><br>
                    Cliquez dessus, puis sur "Liker" !<br>
                    Si vous avez déjà liké un post, l'icône des likes sera :<br>
                    <i class="fas fa-thumbs-up"></i>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DISLIKE A POST ?-->
                <b-button block v-b-toggle.accordion-12 variant="info">Comment disliker un post ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-12" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Sous l'image du post que vous souhaitez disliker vous trouverez l'icône like :<br>
                    <i class="fas fa-thumbs-up"></i><br>
                    Cliquez dessus, puis sur "Disliker" !<br>
                    L'icône des likes redeviendra :<br>
                    <i class="far fa-thumbs-up"></i>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--ACCOUNT ISSUES-->
        <b-tab title="Votre compte">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DISCONNECT ?-->
                <b-button block v-b-toggle.accordion-13 variant="info">Comment me déconnecter ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-13" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour vous déconnecter, il vous suffit de cliquer sur le bouton "Quitter" placé dans la barre de navigation (haut d'écran) : <br><br>
                    <img src="../assets/img/disconnect.png" alt="disconnect" class="img-fluid"/>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO GO ON MY ACCOUNT ?-->
                <b-button block v-b-toggle.accordion-14 variant="info">Comment accéder à mon compte ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-14" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour accéder à votre compte, cliquez sur l'icône : <i class="fas fa-user" style="color: white; padding: 2%; background-color: #2C3F5F; font-size: 1.3em;"></i> dans la barre de navigation ou bien cliquez simplement sur votre photo de profil : <br><br>
                    <img src="../assets/img/account.png" alt="Accès compte" class="img-fluid"/>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO EDIT MY INFO ?-->
                <b-button block v-b-toggle.accordion-15 variant="info">Comment modifier mes informations ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-15" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour modifier vos informations, rendez-vous sur la page de votre compte puis cliquer sur "Editer les informations" :<br>
                    <img src="../assets/img/updateInfo.png" alt="update info" class="img-fluid"/>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DOWNLOAD MY INFOS ?-->
                <b-button block v-b-toggle.accordion-16 variant="info">Comment télécharger mes informations ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-16" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour télécharger vos informations, rendez-vous sur la page de votre compte dans la partie "Paramètres du compte" puis cliquer sur "Télécharger les informations du compte" :<br>
                    <img src="../assets/img/download.png" alt="download info" class="img-fluid"/><br>
                    Votre navigateur devrait lancer le téléchargement du fichier PDF automatiquement !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO DELETE MY ACCOUNT ?-->
                <b-button block v-b-toggle.accordion-17 variant="info">Comment supprimer mon compte ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-17" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour supprimer votre compte, rendez-vous sur la page de votre compte dans la partie "Paramètres du compte" puis cliquer sur "Supprimer le compte" :<br>
                    <img src="../assets/img/delete.png" alt="delete account" class="img-fluid"/><br>
                    Validez votre choix en cliquant sur "Supprimer", votre compte est supprimé !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO EDIT MY CONSENTS ?-->
                <b-button block v-b-toggle.accordion-18 variant="info">Comment modifier mon consentement pour le traitement de mes données ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-18" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour modifier votre consentement pour le traitement de vos données, rendez-vous sur la page de votre compte dans la partie "Paramètres du compte" :<br>
                    <img src="../assets/img/consents.png" alt="update consents" class="img-fluid"/><br>
                    Le réglage par défaut est sur "Non", cliquez sur l'option désirée puis sur "Valider les changements" !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--OTHER USER ISSUES-->
        <b-tab title="Utilisateurs">
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO SEARCH FOR ANOTHER USER ?-->
                <b-button block v-b-toggle.accordion-19 variant="info">Comment rechercher un autre utilisateur ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-19" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour rechercher un utilisateur, cliquez sur le champ de la barre de recherche : <br>
                    <img src="../assets/img/search.png" alt="search bar" class="img-fluid"/><br>
                    Saisissez le nom (ou partie du nom) de l'utilisateur que vous recherchez, cliquez sur la loupe :<br>
                    <img src="../assets/img/searchBtn.png" alt="search button" class="img-fluid"/><br>
                    L'application vous proposera la liste des utilisateurs correspondants à votre recherche !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">

                <!--HOW TO GO ON ANOTHER USER ACCOUNT ?-->
                <b-button block v-b-toggle.accordion-20 variant="info">Comment accéder au profil d'un autre utilisateur ?</b-button>
              </b-card-header>
              <b-collapse id="accordion-20" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text class="m-auto">
                    Pour accéder à la page profil d'un autre utilisateur cliquez simplement sur sa photo de profil !
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-tab>

        <!--ISSUE NOT LISTED-->
        <b-tab title="Autre ?">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-19 variant="info">Mon problème n'est pas répertorié ?</b-button>
            </b-card-header>
            <b-collapse id="accordion-19" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text class="m-auto">
                  Pour tout autre problème n'hésitez pas à nous joindre en cliquant sur la rubrique "Nous contacter", nous vous répondrons dans les plus brefs délais !<br>
                  <img src="../assets/img/contact.png" alt="contact us" class="img-fluid"/>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'faq'
}
</script>

<style scoped>
  h1{
    margin: 2%;
    color: #2C3F5F;
  }
  .card-header{
    border: none;
  }
  #faq{
    flex-grow: 1;
  }
  #tab2{
    margin: 5% auto;
  }
  .fa-thumbs-up{
    color: cornflowerblue;
  }
  .fa-comments{
    color: darkcyan;
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
  .fa-flag{
    color: red;
    margin: 2%;
  }
  i span{
    font-family: Chewy;
  }
</style>
