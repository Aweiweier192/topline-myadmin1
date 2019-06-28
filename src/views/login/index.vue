<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img
          src="./logo_index.png"
          alt=""
        >
      </div>
      <div class="login-form">
        <!--
          表单验证:
          rules 配置验证规则
          将需要验证的字段通过prop属性配置到el-form-item

          ref 获取表单组件, 可手动调用表单组件的验证方法
         -->
        <el-form
          ref="ruleForm"
          :model="form"
          :rules='rules'
        >
          <el-form-item prop='mobile'>
            <el-input
              v-model="form.mobile"
              placeholder='手机号'
            ></el-input>
          </el-form-item>
          <el-form-item prop='code'>
            <!-- 支持栅格布局, 一共为24列 -->
            <el-col :span='12'>
              <el-input
                v-model="form.code"
                placeholder='验证码'
              ></el-input>
            </el-col>
            <el-col
              :span='8'
              :offset='2'
            >
              <el-button
                v-model='secondCount'
                type="primary"
                @click="handleSendCode"
                :disabled='!!timerCount || codeLoading'
              >{{timerCount? `剩余${secondCount}秒`: '获取验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop='checked'>
            <el-checkbox v-model="form.checked">
              <span class='checkspan'>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加class会作用到其根元素上 -->
            <el-button
              class='btn-login'
              type="primary"
              @click="handleLogin"
              :loading='loading'
            >{{load}}</el-button>
            <!-- <el-button>取消</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 已将axios放到Vue原型中 -- $axios
// import axios from 'axios'
// 加载极验模块, 会得到一个全局变量 initGeetest
import '@/vendor/gt.js'
const timerAll = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      // 标签中的记时属性
      secondCount: timerAll,
      // 是否禁用按钮，有计时器时表示计时器的唯一数字
      timerCount: null,
      initeMobile: '',
      codeLoading: false,
      form: {
        mobile: '15603266036',
        code: '246810',
        checked: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度为6个字符', trigger: 'blur' }
        ],
        checked: [
          // pattern 正则表达式
          { required: true, message: '请勾选用户协议', trigger: 'change' },
          { pattern: /true/, message: '请勾选用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null,
      load: '登录',
      loading: false
    }
  },
  methods: {
    handleLogin () {
      // console.log('submit!')
      // 表单验证
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
          // 未通过表单验证
        }
        // 表单验证通过提交登陆
        this.login()
      })
    },
    // 登录
    login () {
      // 设置登录按钮状态
      this.loading = true
      this.load = '加载中'
      this.$axios({
        method: 'POST',
        url: `/authorizations`,
        data: this.form
      }).then(data => { // >= 200 && < 400 的状态码都会进入这里
        // 在响应拦截器处，统一处理响应的数据格式 response.data.data = data
        // 使用本地存储，保存用户信息
        window.localStorage.setItem('userInfo', JSON.stringify(data))
        this.$message({
          message: '登陆成功!',
          type: 'success'
        })
        // console.log(res.data)
        // 建议路由跳转都使用name跳转, 路由传参非常方便
        this.$router.push({
          name: 'home'
        })
        // 设置登录按钮状态
        this.loading = false
        this.load = '登录'
      }).catch(err => { // >=400 的 http 状态码会进入 catch 中
        // console.dir(err)
        if (err.response.status === 400) {
          this.$message.error('登录失败, 手机号或验证码错误!')
        }
        // 设置登录按钮状态
        this.loading = false
        this.load = '登录'
      })
    },
    handleSendCode () {
      // 禁用验证按钮
      this.codeLoading = true
      // 验证手机
      this.$refs['ruleForm'].validateField('mobile', (errorMessage) => {
        if (errorMessage.trim().length > 0) {
          return false
          // 未通过表单验证
        }
      })

      // 是否已有人机交互验证
      if (this.captchaObj) {
        // 判断手机号是否一致
        if (this.initeMobile !== this.form.mobile) {
          // 除去已有的验证码DOM元素
          document.body.removeChild(document.querySelector('.geetest_panel'))
          // 调用获取验证码接口
          this.showGeetest()
        } else {
          // 手机号相同，弹出以有的人机交互验证
          this.captchaObj.verify()
        }
      } else {
        // 这里是第一次初始化验证码插件
        this.showGeetest()
      }
    },

    showGeetest () {
      // const { mobile } = this.form
      this.$axios({
        method: 'GET',
        url: `/captchas/${this.form.mobile}`
      }).then(data => {
        // console.log(this)VueComponent
        // 获取初始化验证码参数
        // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
        // const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'// 隐藏按钮式
        }, (captchaObj) => {
          // console.log(this)undefined
          // console.log(this)VueComponent <-- 箭头函数
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          // console.log(captchaObj)
          captchaObj.onReady(() => {
            // 获取初始化手机号
            this.initeMobile = this.form.mobile
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()// 显示验证码
            // 解除验证码禁用
            this.codeLoading = false
          }).onSuccess(() => {
            // your code
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            // console.log(captchaObj.getValidate())
            // 调用 获取短信验证码 (极验 API2）接口，发送短信
            this.$axios({
              method: 'GET',
              url: `/sms/codes/${this.form.mobile}`,
              params: { // 专门用来传递query查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(data => {
              // 发送验证码成功
              // console.log(res.data)
              // 函数中的 function函数中的this指向window
              // 人机交互成功后，验证按钮到计时
              this.timeDown()
            })
          }).onError(function () {
            // your code
          })
          // 按钮提交事件
          // some code
          // 检测验证码是否ready, 验证码的onReady是否执行
          // some code
        })
      })
    },
    // 倒计时
    timeDown () {
      // timerCount不为null，禁用按钮
      this.timerCount = window.setInterval(() => {
        if (this.secondCount > 0) {
          // 秒数递减
          this.secondCount--
        } else {
          this.secondCount = 0
          // 为零时，停止倒计时
          window.clearInterval(this.timerCount)
          // 解开禁用的按钮
          this.timerCount = null
          this.secondCount = timerAll
        }
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.login-wrap {
  height: 100%;
  display: flex;
  // 让内容在页面居中显示
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg");
  .login-form-wrap {
    padding: 15px 20px 8px;
    border-radius: 6px;
    background: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 8px;
      padding-bottom: 8px;
      img {
        width: 65%;
      }
    }
    .btn-login {
      width: 100%;
    }
    .checkspan {
      padding-left: -10px;
    }
  }
}
</style>
