<template>
  <div id="app">
    <!-- 路由坑 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  #app {
    height: 100%;
  }
</style>
