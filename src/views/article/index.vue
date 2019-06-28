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
        :model="filterParams"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="文章状态">
          <el-radio-group
            v-model="filterParams.status"
            size="medium"
          >
            <el-radio label="">All</el-radio>
            <el-radio
              v-for='(item, index) of stateTypes'
              :key='item.label'
              :label="index + ''"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <!-- <el-select
            v-model="filterParams.channel_id"
            placeholder="请选择频道"
          >
            <el-option
              label='All'
              value=''
            ></el-option>
            <el-option
              v-for='item of channels'
              :label="item.name"
              :value="item.id"
              :key='item.name'
            ></el-option>
          </el-select> -->
          <!-- <article-channels
            v-model='filterParams.channel_id'
            是下面两个的简写
            :value='filterParams.channel_id'
            @input='filterParams.channel_id = $event'
          ></article-channels> -->
          <article-channels
            v-model='filterParams.channel_id'
          ></article-channels>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-col :span="11">
            <el-date-picker
              value-format='yyyy-MM-dd'
              v-model='begin_end_pubdate'
              @change='handleDateChange'
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="articleLoading"
            @click="handleOnSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表区 -->
    <el-card class="list-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>共找到-<strong>{{totalCount}}</strong>-条符合条件的内容</span>
      </div>
      <!--
        data: 用来指定表格数据，表格不需要我们自己动手遍历
        只需要把数据给el-table的data属性就可以
        然后配置el-table-column 需要展示的数据字段即可
      -->
      <el-table
        v-loading="articleLoading"
        :data="articles"
        style="width: 100%"
      >
        <el-table-column
          prop="cover.images[0]"
          label="封面"
          width='100'
        >
          <!--
          表格列只能输出文本，如需要自定义里面的内容，则需要以下操作
          slot-scope 是插槽作用域scope是起的一个名字
          scope中的一个成员row, scope.row就是当前遍历项的对象
          其中el-table-column就没意义了
         -->
          <template slot-scope='scope'>
            <img
              width='50'
              :src="scope.row.cover.images[0]"
              alt=""
            >
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="id"
          label="id"
          width="180"
        >
        </el-table-column> -->
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180"
        >
          <template slot-scope='scope'>
            <el-tag :type="stateTypes[scope.row.status].type">{{stateTypes[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <el-button
              type='success'
              plain
              @click='$router.push(`/publish/${scope.row.id}`)'
            >修改</el-button>
            <el-button
              type='danger'
              plain
              @click='handleDelete(scope.row)'
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 数据分页
      total：数据总条数
      disabled：禁用分页
      current-change: 改变时触发，自动获取当前页数
      current-page: 使得当前页码高亮显示
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :current-page='page'
      :disabled='articleLoading'
      @current-change='handleCurrentChange'
    >
    </el-pagination>
  </div>

</template>

<script>
import ArticleChannels from '@/components/article-channels'

export default {
  name: 'Article',
  components: {
    ArticleChannels
  },
  data () {
    return {
      page: 1,
      articles: [],
      totalCount: 0,
      articleLoading: false,
      stateTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      channels: [],
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      begin_end_pubdate: []
    }
  },
  created () {
    // 请求文章方法
    this.loadArticles()
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
    loadArticles (page = 1) {
      // 请求数据时禁用分页
      this.articleLoading = true
      // 过滤出有效的查询条件数据字段
      const filterData = {}
      for (let key in this.filterParams) {
        // 判断属性是否为空
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      // console.log(filterData)
      this.$axios({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求页码，不传默认为 1
          per_page: 10, // 请求每页数据个数，不传默认为 10
          ...filterData // 将对象混入当前对象
        }
      }).then(data => {
        // console.log(data)
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        // 得到数据后可用分页
        this.articleLoading = false
      })
    },
    handleCurrentChange (page) {
      this.page = page
      this.loadArticles(page)
    },
    handleDelete (article) {
      // 但其在整数拼接时默认toString
      // article.id.toString()
      // this.$axios({
      //   method: 'DELETE',
      //   url: `/articles/${article.id}`
      // }).then(data => {
      //   // console.log(data)
      //   this.loadArticles(this.page)
      // })
      // 添加提示功能
      this.$confirm('确定删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确定执行
        // 发送删除请求
        this.$axios({
          method: 'DELETE',
          url: `/articles/${article.id}`

        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          // 重新加载数据
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    },
    // 选定日期触发事件
    handleDateChange (date) {
      // console.log(date)
      this.filterParams.begin_pubdate = date[0]
      this.filterParams.end_pubdate = date[1]
    },
    handleOnSubmit () {
      // console.log('submit!')
      this.page = 1
      this.loadArticles()
    }
    // handleEdit (article) {
    //   // console.log(article.id.toString())
    //   this.$route.push({
    //     name: 'publish',

    //   })
    // }
  }
}
</script>

<style lang='less' scoped>
.fliter-card {
  margin-bottom: 15px;
}
.list-card {
  margin-bottom: 20px;
}
</style>
