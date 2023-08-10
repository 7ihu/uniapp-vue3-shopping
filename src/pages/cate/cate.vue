<template>
  <view class="cate">
    <!-- 左侧滑动 -->
    <scroll-view scroll-y class="left" :style="{ height: availableHeight + 'px' }">
      <view :class="['left-item', newId === i ? 'active' : '']" v-for="(item, i) in cateList" :key="i"
        @click="idclick(i)">
        {{ item.cat_name }}
      </view>
    </scroll-view>
    <!-- 右侧滑动 -->
    <scroll-view scroll-y class="right" :style="{ height: availableHeight + 'px' }" :scroll-top="distance">
      <view v-for="(item, i) in acteListTwo" :key="i">
        <text class="right-text">/ {{ item.cat_name }} \</text>
        <view class="right-item">
          <navigator v-for="(items, index) in item.children" :key="index" class="right-items"
            :url="'/pages/detail/detail?goods_id=' + items.cat_id">
            <!-- <image :src="items.cat_icon"></image> -->
            <text>{{ items.cat_name }}</text>
          </navigator>
        </view>


      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 页面可用高度
      availableHeight: 0,
      // 分类数据
      cateList: [],
      newId: 0,
      acteListTwo: [],
      distance: 0
    }
  },
  onLoad() {
    // 获取页面可用高度
    this.availableHeight = uni.getSystemInfoSync().windowHeight
    this.getCateList();
  },
  methods: {
    async getCateList() {
      // 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/categories')
      // 判断是否获取失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 转存数据
      this.cateList = res.message
      this.acteListTwo = res.message[0].children
    },



    idclick(i) {
      this.newId = i
      this.acteListTwo = this.cateList[i].children
      this.distance = this.distance ? 0 : 1
    },
    // Jump(items) {
    //   console.log(items.cat_id);
    //   uni.navigateTo({
    //     url: '/subpkg/goods_detail/goods_detail?goods_id=' + items.cat_id
    //   })
    // }
  }
}
</script>

<style scoped lang="scss">
.cate {
  display: flex;
  justify-content: start;
  width: 100%;

  .left {
    width: 200rpx;

    .left-item {
      width: 200rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      background-color: #f5f6fa;

      &.active {
        position: relative;
        background-color: #fff;

        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          content: ' ';
          width: 5rpx;
          height: 60rpx;
          background-color: red;
          transform: translateY(-50%);
        }
      }
    }
  }

  .right {
    font-size: 25rpx;

    .right-text {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      margin: 25rpx 0;
      text-align: center;
    }

    .right-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      padding-bottom: 15rpx;


      .right-items {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 150rpx;
        height: 150rpx;
        margin: 15rpx 15rpx 15rpx 18rpx;
        background: lightgrey;

        image {
          width: 150rpx;
          height: 120rpx;
          background: lightcyan;
        }
      }
    }
  }
}
</style>