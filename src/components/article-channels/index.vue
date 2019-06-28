<template>
  <!-- el-select 组件
    value 属性： 用来绑定需要同步的数据
    不能使用v-model双向数据绑定 -- 子组件不能改父组件
    change 事件： 当选中项发生改变时被触发，回调参数就是选中项的 value
 -->
  <el-select
    clearable
    placeholder="请选择频道"
    :value='value'
    @change='handleChange'
  >
    <el-option
      v-for='item of channels'
      :label="item.name"
      :value="item.id"
      :key='item.name'
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Articlechannels',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then((data) => {
        // console.log(data)
        this.channels = data.channels
      })
    },
    handleChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
