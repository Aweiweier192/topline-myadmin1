<template>
  <el-container>
    <el-aside width="200px">
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader></AppHeader>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  <!-- <div>
  </div> -->
</template>

<script>
import AppAside from './component/AppAside.vue'
import AppHeader from './component/AppHeader.vue'

export default {
  name: 'Layout',
  data () {
    return {
    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #d0dce7;
}
.el-header {
  background: #aec0d1;
}
</style>
