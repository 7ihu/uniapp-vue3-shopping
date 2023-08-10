<template>
  <view class="home">
    <!-- 轮播图区域 -->
    <view class="home-swiper">
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <!-- 循环渲染轮播图的 item 项 -->
        <swiper-item v-for="(item, i) in swiperList" :key="i">
          <navigator class="swiper-item" :url="'/pages/detail/detail?goods_id=' + item.navigator_url.split('=')[1]"
            open-type="navigate" hover-class="navigator-hover">
            <!-- 动态绑定图片的 src 属性 -->
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>

    <!-- nav 导航栏区域 -->
    <view class="nav">
      <navigator v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="">
        </image>
      </navigator>
    </view>

    <!-- 楼层部分 -->
    <view class="floor">
      <view v-for="(item, i) in floorList" :key="i">
        <text>{{ item.floor_title.name }}</text>
        <view class="floor-view">
          <navigator :url="item.product_list[0].url" class="detail">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }"
              mode="widthFix"></image>
          </navigator>
          <view class="details">
            <navigator v-for="( items, index ) in  item.product_list.slice(1) " :key="index" :url="items.url">
              <image :src="items.image_src" mode="widthFix" :style="{ width: items.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { log } from 'console'
export default {
  data() {
    return {
      // 轮播图的数据列表，默认为空数组
      swiperList: [],
      // 分类数据
      navList: [],
      // 具体数据、楼层页面
      floorList: [],
    }
  },
  onLoad() {
    // 在小程序页面刚加载的时候，调用获取轮播图数据的方法
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },
  methods: {
    // 获取轮播图数据的方法
    async getSwiperList() {
      // 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 请求成功，为 data 中的数据赋值
      this.swiperList = res.message
    },

    // 获取导航栏数据
    async getNavList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 请求成功，为 data 中的数据赋值
      this.navList = res.message
    },

    // 获取楼层数据
    async getFloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 请求成功，为 data 中的数据赋值
      // 通过双层 forEach 循环，处理 URL 地址
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/pages/detail/detail?' + prod.navigator_url.split('?')[1]
        })
      })

      this.floorList = res.message
    },

    // 点击事件
    navClickHandler(item) {
      if (item.name === '分类') return uni.switchTab({ url: '/pages/cate/cate' })
    }
  },
}
</script>

<style scoped lang="scss">
.home {
  .home-swiper {
    padding-top: 20rpx;

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
  }

  .nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 200rpx;
    padding: 10rpx 0;

    navigator {
      image {
        width: 160rpx;
        height: 180rpx;
      }
    }
  }

  .floor {
    text {
      color: pink;
      font-size: 35rpx;
      font-weight: 500;
      margin: 5rpx 0 0 10rpx;
    }

    .floor-view {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 400rpx;
      padding: 10rpx 6rpx;
      // background-color: red;

      .details {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        // width: 70%;
      }
    }
  }
}
</style>