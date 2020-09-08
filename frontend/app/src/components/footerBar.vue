<template>
  <div class="container-fluid navbarbg">
    <b-button href="https://www.groupomania.fr" class="col-3 btn"><img src="../assets/img/logoFooter.png" alt="Logo Groupomania"></b-button>
    <b-button class="col-3 btn"><span>Nous contacter</span></b-button>
    <b-button class="col-3 btn"><span>FAQ</span></b-button>
  </div>
</template>

<script>
export default {
  name: 'footerBar'
}
</script>

<style scoped>
  .navbarbg{
    padding: 1%;
    overflow-x: hidden;
    background-image: url("../assets/img/bgfooter.png");
    background-size: cover;
  }
  .btn{
    color: black;
    background-color: transparent;
    border: none;
  }
  .btn img{
    object-fit: scale-down;
    max-width: 45%;
    margin: 2%;
  }
  span{
    color: black;
    font-size: 25px;
    text-decoration: underline;
  }
  .btn:hover{
    background-color: rgba(44, 63, 95, 0.5);
  }
</style>
