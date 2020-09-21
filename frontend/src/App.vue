<template>
    <div id="app">
      <nav-bar></nav-bar>
        <div>Test</div>
      <router-view></router-view>
      <footer>
        <footerBar></footerBar>
      </footer>
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
