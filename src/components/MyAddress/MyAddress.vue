<template>
  <view class="myadress"  v-if="cart.length !== 0">
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">{{ aa }}请选择收货地址</button>
    </view>

    <!-- 渲染收货信息的盒子 -->
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" @click="chooseAddress" v-else>
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{ address.userName }}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{ address.telNumber }}</text></view>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
      <view class="more">></view>
    </view>

    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: "MyAdress",
  data() {
    return {
    };
  },
  computed: {
    // 收货详细地址的计算属性
    ...mapState(['cart','address']),
    ...mapGetters(['addstr'])
  },
  methods: {
    ...mapMutations(['updateAddress']),
    async chooseAddress() {
      // 调用小程序提供的 chooseAddress() 方法,返回值是一个数组：第1项为错误对象；第2项为成功之后的收货地址对象
      const res = await uni.chooseAddress().catch(err => err)
      console.log(res);
      // 用户成功的选择了收货地址
      if (res.errMsg === 'chooseAddress:ok') {
        this.updateAddress(res)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  position: relative;
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15rpx 30rpx 15rpx 15rpx;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 15rpx;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }

  .more {
    position: absolute;
    top: 5rpx;
    right: 12rpx;
    height: 90px;
    line-height: 90px;
    font-size: 35rpx;
  }
}
</style>
    
      