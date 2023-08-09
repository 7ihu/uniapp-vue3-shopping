<template>
  <view class="home">
    <view class="home-swiper">
      <!-- 轮播图区域 -->
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <!-- 循环渲染轮播图的 item 项 -->
        <swiper-item v-for="(item, i) in swiperList" :key="i">
          <navigator class="swiper-item"
            :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.navigator_url.split('=')[1]" open-type="navigate"
            hover-class="navigator-hover">
            <!-- 动态绑定图片的 src 属性 -->
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>

  </view>
</template>

<script>
import { log } from 'console'
export default {
  data() {
    return {
      // 1. 轮播图的数据列表，默认为空数组
      swiperList: [],
    }
  },
  onLoad() {
    // 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
    this.getSwiperList()
  },
  methods: {
    // 3. 获取轮播图数据的方法
    async getSwiperList() {
      // 3.1 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
      console.log(res);
      // 3.2 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 3.3 请求成功，为 data 中的数据赋值
      this.swiperList = res.message
    },
  },
}
</script>

<style scoped lang="scss">
swiper {
  height: 330rpx;
  margin: 0 10rpx;
  border-radius: 20rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
}
</style>