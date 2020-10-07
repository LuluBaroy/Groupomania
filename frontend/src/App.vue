<template>
    <div id="app">
      <!--NAVBAR - SEE COMPONENT 'navBar.vue'-->
      <nav-bar></nav-bar>

      <!--ROUTER - SEE 'router/index.js'-->
      <router-view></router-view>

      <!--FOOTERBAR - SEE COMPONENT 'footerBar.vue'-->
      <footerBar></footerBar>
    </div>
</template>

<script>
import navBar from './components/navBar'
import footerBar from './components/footerBar'
export default {
  name: 'App',
  components: {navBar, footerBar}
}
</script>

<style>
@font-face {
  font-family: 'Chewy';
  src: url("./assets/fonts/Chewy.woff") format('woff');
}
a, button, i{
  outline: 0 none !important;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Chewy';
  text-align: center;
  margin: 0;
  padding: 0;
}
</style>
