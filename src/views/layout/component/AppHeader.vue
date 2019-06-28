<template>
  <el-row :gutter="20">
    <el-col :span="14">
      江苏传智播客教育科技股份有限公司
    </el-col>
    <el-col
      :span="6"
      :offset='4'
    >
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            width='30'
            :src="userInfo.photo"
            alt=""
          >
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">账户设置</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
const { name, photo } = JSON.parse(window.localStorage.getItem('userInfo'))
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {
        name,
        photo
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  }
}
</script>

<style lang='less' scoped>
.el-row {
  height: 100%;
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
