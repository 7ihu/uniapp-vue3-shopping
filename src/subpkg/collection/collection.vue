<template>
  <view class="collection">
    <view class="top">{{ time }}</view>
    <view class="center" v-if="time">当前数据暂无！</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      time: JSON.parse(uni.getStorageSync('time') || ''),
    };
  },
  onLoad() {
    this.timer()
  },
  onUnload() {
    uni.setStorageSync('time', JSON.stringify(''))
  },
  methods: {
    timer() {
      this.time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      uni.setStorageSync('time', JSON.stringify(this.time))
      uni.$showMsg('数据调用失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.collection {
  width: 100%;
  height: 100%;
  padding-bottom: 930rpx;
  background-color: #f1f2f6;
  font-size: 45rpx;
  box-shadow: 0 15rpx 30rpx 15rpx rgb(235, 242, 240);

  .top {
    width: 100%;
    height: 200rpx;
    line-height: 200rpx;
    color: red;
    font-size: 35rpx;
    padding: 5rpx 20rpx;
    margin: 10rpx 0 50rpx;
  }
  .center{
    color: #f39c12;
    padding-left: 60rpx;
  }
}
</style>
    
      