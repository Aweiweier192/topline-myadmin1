<template>
  <!--
    el-menu
        default-active 指定默认激活的菜单项
        @open、@close 展示和收起菜单项时触发
        bgc 设置菜单栏背景颜色
        tc 菜单栏文本颜色
        activ-text-color激活时的文字颜色
        router 是否使用vue-router模式，启用该模式会在
        激活导航时以index作为path进行路由跳转
    el-submenu
        index 导航标识，可以用作导航路径， 必须唯一
 -->
  <el-menu
    router
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!-- <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <template slot="title">选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu> -->

    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-eleme"></i>
        <span>内容</span>
      </template>
      <el-menu-item index="/publish">发布文章</el-menu-item>
      <!-- index中的路由也可以使用name名 -->
      <el-menu-item index="article">内容列表</el-menu-item>
      <el-menu-item index="2-3">评论列表</el-menu-item>
      <el-menu-item index="2-4">素材管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-s-grid"></i>
        <span>粉丝管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="3-1">
          <i class="el-icon-picture"></i>
          <span slot="title">图文数据</span>
        </el-menu-item>
        <el-menu-item index="3-2">粉丝概况</el-menu-item>
        <el-menu-item index="3-3">粉丝画像</el-menu-item>
        <el-menu-item index="3-4">粉丝列表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="4">
      <i class="el-icon-s-management"></i>
      <span slot="title">账户设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang='less' scoped>
.el-menu {
  height: 100%;
}
</style>
