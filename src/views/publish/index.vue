<template>
  <el-card class="pub-card">
    <div
      class='header'
      slot="header"
    >
      <h3>{{isEdit? '编辑': '发布'}}文章</h3>
      <div>
        <el-button
          type="primary"
          @click='handlePublish(false)'
          :disabled='articleLoading || publishLoading'
        >{{isEdit? '编辑': '添加'}}文章</el-button>
        <el-button
          type="success"
          @click='handlePublish(true)'
          :disabled='articleLoading || publishLoading'
        >加入草稿</el-button>
      </div>
    </div>
    <el-form
      :model='pubArticle'
      v-loading="isEdit && articleLoading"
    >
      <el-form-item label='name'>
        <el-input
          type='text'
          v-model='pubArticle.title'
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-input
          type='textarea'
          v-model='pubArticle.content'
        ></el-input> -->
        <!-- 富文本编辑器 -->
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor
          v-model="pubArticle.content"
          ref="myQuillEditor"
          :options="editorOption"
        >
        </quill-editor>
      </el-form-item>
      <el-form-item label='cover'>
      </el-form-item>
      <el-form-item label='channels'>
        <!--频道列表组件
          不区分字母大小写
          使用 v-model='pubArticle.channel_id'
          代替下面两行属性
          :value="pubArticle.channel_id"
          @input='pubArticle.channel_id = $event'
         -->
        <article-channel v-model='pubArticle.channel_id'></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 引入频道列表组件
import ArticleChannel from '@/components/article-channels'

// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Publish',
  components: {
    // 成为子组件
    ArticleChannel,
    // 富文本编辑器
    quillEditor
  },
  data () {
    return {
      pubArticle: {
        title: '',
        content: '',
        channel_id: 3,
        cover: {
          type: 0,
          images: []
        }
      },
      articleLoading: false,
      publishLoading: false,
      editorOption: {
        // some quill options
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    }
  },
  mounted () {
    // console.log('this is current quill instance object', this.editor)
  },
  created () {
    // console.log(this.$route)
    // 如果为true就调用loadArticle
    this.isEdit && this.loadArticle()
  },
  methods: {
    handlePublish (draft) {
      this.publishLoading = true
      if (this.isEdit) {
        this.submitEdit().then(() => {
          this.publishLoading = false
        })
      } else {
        this.submitAdd().then(() => {
          this.publishLoading = false
        })
      }
      // this.isEdit? this.submitEdit(): this.submitAdd()
    },
    // 加载编辑文章
    loadArticle () {
      this.articleLoading = true
      // console.log(target)
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.id}`
      }).then(data => {
        // console.log(data)
        this.pubArticle = data
        this.articleLoading = false
      }).catch(err => {
        this.$message.error('加载文章详情失败！')
        return err
      })
    },
    // 发布新文章
    submitAdd (draft) {
      return this.$axios({
        method: 'POST',
        url: '/articles',
        params: {
          draft
        },
        data: this.pubArticle
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发布成功！'
        })
        this.$router.push({
          name: 'article'
        })
      }).catch(err => {
        this.$message.error('发布失败！')
        return err
      })
    },
    // 发布编辑文章
    submitEdit (draft) {
      return this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.id}`,
        params: {
          draft
        },
        data: this.pubArticle
      }).then(data => {
        this.$message({
          type: 'success',
          message: '编辑成功！'
        })
        this.$router.push({
          name: 'article'
        })
      }).catch(err => {
        this.$message.error('编辑失败！')
        return err
      })
    }
  }
}
</script>

<style lang='less' scoped>
.pub-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
