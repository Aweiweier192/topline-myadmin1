<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="fliter-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>卡片名称</span>
        <!-- <el-button
          style="float: right; padding: 3px 0"
          type="text"
        >操作按钮</el-button> -->
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="特殊资源">
          <el-radio-group
            v-model="form.resource"
            size="medium"
          >
            <el-radio
              border
              label="线上品牌商赞助"
            ></el-radio>
            <el-radio
              border
              label="线下场地免费"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select
            v-model="form.region"
            placeholder="请选择活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            ></el-option>
            <el-option
              label="区域二"
              value="beijing"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表区 -->
    <el-card class="list-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>共找到---条符合条件的内容</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
        >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang='less' scoped>
.fliter-card {
    margin-bottom: 15px;
}
</style>
