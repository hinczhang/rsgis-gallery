<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    sessionStorage.clear();
  },
  created() {
    window.createModel("tororo");
    // 测试session & localStorage
    //localStorage.setItem("user_name","2017302590137");//account login-登录人的userid
    //sessionStorage.setItem("userName","张雨杭");
    //sessionStorage.setItem("userId","2017302590137");//target
    //sessionStorage.setItem("item","test");
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
