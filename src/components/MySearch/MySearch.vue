<template>
  <view class="mySearch">
    <view class="mySearch-view" @click="JumpSearch">
      <icon type="search" size="14" />
      <text>&nbsp;搜索</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "MySearch",
  data() {
    return {

    }
  },
  methods: {
    JumpSearch() {
      uni.navigateTo({
        url: '/subpkg/search/search',
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.mySearch {
  display: flex;
  align-items: center;
  height: 120rpx;
  padding: 0 20rpx;
  background-color: #c00000;

  .mySearch-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60rpx;
    border-radius: 40rpx;
    background-color: #fff;
  }
}
</style>
    
      