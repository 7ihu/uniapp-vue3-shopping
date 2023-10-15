<template>
  <view class="my">
    <!-- 用户未登录时，显示登录组件 -->
    <view class="login-container" v-if="!token">
      <!-- 提示登录的图标 -->
      <icon type="info" size="100"></icon>
      <!-- 登录按钮 -->
      <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
      <!-- 登录提示 -->
      <view class="tips-text">登录后尽享更多权益</view>
    </view>

    <!-- 用户登录后，显示用户信息组件 -->
    <view class="my-userinfo" v-else>
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <image :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{ userinfo.nickName }}</view>
      </view>
      <!-- 面板的列表区域 -->
      <view class="panel-list">
        <!-- 第一个面板 -->
        <view class="panel">
          <!-- panel 的主体区域 -->
          <view class="panel-body" @click="jumpCollection">
            <!-- panel 的 item 项 -->
            <view class="panel-item">
              <text>{{ cart.length }}</text>
              <text>收藏的商品</text>
            </view>
            <view class="panel-item">
              <text>{{ cart.length * 2 }}</text>
              <text>足迹</text>
            </view>
          </view>
        </view>

        <!-- 第二个面板 -->
        <view class="panel" @click="jumpGoods">
          <!-- 面板的标题 -->
          <view class="panel-title">我的订单</view>
          <!-- 面板的主体 -->
          <view class="panel-title-body">
            <!-- 面板主体中的 item 项 -->
            <view class="panel-item">
              <image src="/static/icons/icon1.png" class="icon"></image>
              <text>历史订单</text>
            </view>
            <view class="panel-item">
              <image src="/static/icons/icon3.png" class="icon"></image>
              <text>退款/退货</text>
            </view>
            <view class="panel-item">
              <image src="/static/icons/icon4.png" class="icon"></image>
              <text>全部订单</text>
            </view>
          </view>
        </view>

        <!-- 第三个面板 -->
        <view class="panel">
          <view class="panel-list-item" @click="chooseAddress">
            <text>收货地址</text>
            <text>></text>
          </view>
          <view class="panel-list-item" @click="outOfLogin">
            <text>退出登录</text>
            <text>></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['userinfo', 'token', 'cart']),

  },
  methods: {
    ...mapMutations(['updateUserInfo', 'updateToken', 'updateAddress']),
    getUserProfile() {
      uni.getUserProfile({
        desc: '你的授权信息',
        success: (res) => {
          // 将信息存到 vuex 中
          this.updateUserInfo(res.userInfo)
          this.getToken(res)
        },
        fail: () => {
          return uni.$showMsg('您取消了登录授权!')
        }
      })
    },
    // 调用登录接口，换取永久的 token
    async getToken(info) {
      // 调用微信登录接口
      const res = await uni.login().catch(err => err)
      // 判断是否 uni.login() 调用失败
      if (res.errMsg !== 'login:ok') return uni.$showError('登录失败！')

      // // 换取 token
      const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', {
        code: res.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      })
      // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
      uni.$showMsg('登录成功')
      const successToken = 'Bearer eyJhbGciOiJIUzl1NilsInR5cCl6lkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MZAwNzksImV4cCI6MTAWMTU2NDCZMDA3OHO.YPt-XeLnjV-1lTaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      this.updateToken(successToken)
    },
    outOfLogin() {
      uni.showModal({
        title: '退出',
        content: '确定退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.$showMsg('请求加载中...', 1000, 'loading')
            setTimeout(() => {
              this.updateUserInfo({})
              this.updateToken('')
              this.updateAddress({})
            }, 1000)
          }
        }
      })
    },
    jumpGoods() {
      uni.navigateTo({ url: '/subpkg/orderForm/orderForm' })
    },
    jumpCollection() {
      uni.navigateTo({ url: '/subpkg/collection/collection' })
    },
    async chooseAddress() {
      // 调用小程序提供的 chooseAddress() 方法,返回值是一个数组：第1项为错误对象；第2项为成功之后的收货地址对象
      const res = await uni.chooseAddress().catch(err => err)
      console.log(res);
      // 用户成功的选择了收货地址
      if (res.errMsg === 'chooseAddress:ok') {
        this.updateAddress(res)
      }
    }
  },
}
</script>

<style scoped lang="scss">
page,
.my {
  height: 100%;

  .login-container {
    position: relative;
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 100rpx;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100rpx;
      margin: 30rpx 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 25rpx;
      color: gray;
    }
  }

  .my-userinfo {
    height: 100%;
    // 为整个组件的结构添加浅灰色的背景
    background-color: #f4f4f4;

    .top-box {
      height: 450rpx;
      background-color: #c00000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .avatar {
        display: block;
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 8rpx black;
      }

      .nickname {
        color: white;
        font-weight: bold;
        font-size: 30rpx;
        margin-top: 20rpx;
      }
    }

    .panel-list {
      position: relative;
      top: -20rpx;
      padding: 0 20rpx;

      .panel {
        border-radius: 5rpx;
        margin-bottom: 20rpx;
        background-color: white;

        .panel-body {
          display: flex;
          justify-content: space-around;
          height: 150rpx;

          .panel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            font-size: 25rpx;
            padding: 20rpx 0;
          }
        }

        .panel-title {
          line-height: 45px;
          padding-left: 10px;
          font-size: 15px;
          border-bottom: 1px solid #f4f4f4;
        }

        .panel-title-body {
          display: flex;
          justify-content: space-around;

          .panel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            font-size: 13px;
            padding: 10px 0;

            .icon {
              width: 35px;
              height: 35px;
            }
          }
        }

        .panel-list-item {
          height: 100rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 30rpx;
          padding: 0 30rpx;
        }
      }
    }
  }
}
</style>