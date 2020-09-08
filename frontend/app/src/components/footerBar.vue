<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="navbarbg">
      <b-navbar-brand><img src="../assets/logoFooter.png" alt="Logo Groupomania"></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" class="fontColor"><span>Nous contacter</span></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" class="fontColor"><span>FAQ</span></b-nav-item>
        </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'footer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navbarbg{
    background-color: transparent;
    background-image: url('../assets/bgfooter.png');
    opacity: 0.5;
  }
  .navbar-brand{
    width: 10%;
  }
  span{
    color: black;
    font-size: 25px;
  }
  span:hover{
    color: grey;
  }
  img{
    max-width: 100%;
  }
</style>
