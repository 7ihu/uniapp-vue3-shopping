<template>
  <view class="goods-detail">
    <view>
      <!-- 轮播图区域 -->
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <swiper-item v-for="(item, i) in goodsDetails.pics" :key="i">
          <image :src="item.pics_big" @click="preview(i)"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品信息区域 -->
    <view class="goods-info" v-if="goodsDetails.goods_name">
      <!-- 商品价格 -->
      <view class="goods-info-box">
        <view class="goods-price">￥{{ goodsDetails.goods_price?.toFixed(2) }}</view>
        <view class="goods-number">数量：<text class="goods-price">{{ goodsDetails.goods_number }}</text></view>
      </view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{ goodsDetails.goods_name }}</view>
        <!-- 收藏 -->
        <view class="favi" @click="flag = !flag">
          <image src="../../static/my-icons/collection-fill.png" mode="scaleToFill" v-if="flag" />
          <image src="../../static/my-icons/collection.png" mode="scaleToFill" v-else />

          <text :style="flag ? 'color:red;font-weight: 600;' : ''">收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详情信息 -->
    <view class="goods-image" v-if="goodsDetails.goods_introduce">
      <text>/ 商品详情 /</text>
      <rich-text :nodes="goodsDetails.goods_introduce"></rich-text>
    </view>
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <view class="shop" @click="jumpHome">
        <!-- <icon type="info" size="21" color="rgb(16, 174, 255)"></icon> -->
        <image src="../../static/my-icons/home.png" mode="scaleToFill" />
        <text>首页</text>
      </view>
      <view class="cart" @click="jumpCart">
        <image src="../../static/my-icons/cart-empty.png" mode="scaleToFill" />
        <text class="cartInfo" v-if="total">{{ total }}</text>
        <text>购物车</text>
      </view>
      <view class="buy">
        <button class="addCart public" @click="addCart">加入购物车</button>
        <button class="buyNow public" @click="jumpBuy">立即购买</button>
      </view>
    </view>
  </view>
</template>

<script>
// 从 vuex 中按需导出 mapState 辅助方法,按需导入 mapMutations 这个辅助方法
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      flag: false,
      goodsDetails: [],
      id: ''
    };
  },
  computed: {
    // 调用 mapState 方法，把  cart 数组映射到当前页面中，作为计算属性来使用
    // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
    ...mapState(['cart','frequency']),
    ...mapGetters(['total'])
  },
  onLoad(options) {
    this.id = options.goods_id;
    this.frequencyId()
    this.getgoodsDetails(options.goods_id)
  },
  methods: {
    // 把 addToCart 方法映射到当前页面使用
    ...mapMutations(['addToCart', 'showHideId','frequencyId']),
    async getgoodsDetails(goods_id) {
      const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
      if (res.meta.status !== 200) return uni.$showMsg()
      // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
      // 为 data 中的数据赋值
      this.goodsDetails = res.message
    },
    // 实现轮播图的预览效果
    preview(i) {
      // 调用 uni.previewImage() 方法预览图片
      uni.previewImage({
        // 预览时，默认显示图片的索引
        current: i,
        // 所有图片 url 地址的数组
        urls: this.goodsDetails.pics.map(x => x.pics_big)
      })
    },

    // 点击跳转
    jumpHome() {
      uni.switchTab({ url: '/pages/home/home' })
    },
    // 点击购物车跳转
    jumpCart() {
      this.frequencyId()
      this.showHideId(this.id)
      uni.switchTab({ url: '/pages/cart/cart' })
    },
    // 点击加入购物车
    addCart() {
      const goods = {
        goods_id: this.goodsDetails.goods_id,       // 商品的Id
        goods_name: this.goodsDetails.goods_name,   // 商品的名称
        goods_price: this.goodsDetails.goods_price, // 商品的价格
        goods_count: 1,                           // 商品的数量
        goods_small_logo: this.goodsDetails.goods_small_logo, // 商品的图片
        goods_state: true                         // 商品的勾选状态
      }

      // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
      this.addToCart(goods)
    },
    // 点击立即购买
    // jumpBuy() { }
  }
}
</script>

<style lang="scss" scoped>
.goods-detail {
  swiper {
    height: 700rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域的样式
  .goods-info {
    padding: 10px;
    padding-right: 0;

    .goods-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60rpx;
      padding: 0 15rpx;


      .goods-price {
        font-size: 20px;
        color: #c00000;
      }

      .goods-number {
        font-size: 15px;
        padding-right: 10rpx;
      }
    }

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      // border: 1px solid red;

      .goods-name {
        height: 80rpx;
        font-size: 26rpx;
        padding-right: 15rpx;
      }

      // 收藏区域
      .favi {
        width: 220rpx;
        font-size: 26rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;

        image {
          width: 70rpx;
          height: 60rpx;
        }
      }
    }

    // 运费
    .yf {
      margin: 10rpx 0;
      font-size: 24rpx;
      color: gray;
    }
  }

  .goods-image {
    font-size: 30rpx;
    font-weight: 600;
    text-align: center;
    padding-bottom: 50px;
    border-top: 1px solid gray;

    text {
      display: block;
      height: 80rpx;
      line-height: 80rpx;
    }
  }

  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100rpx;
    background-color: #fff;

    .shop,
    .cart {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size: 26rpx;
      height: 80rpx;

      image {
        width: 60rpx;
      }
    }

    .cart {
      position: relative;

      .cartInfo {
        position: absolute;
        top: -3rpx;
        right: 1rpx;
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        font-size: 20rpx;
        color: #fff;
        background-color: red;
        border-radius: 50%;
      }
    }

    .buy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 500rpx;

      .addCart {
        border-top-left-radius: 60rpx;
        border-bottom-left-radius: 60rpx;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: #ff0000;
      }

      .buyNow {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 60rpx;
        border-bottom-right-radius: 60rpx;
        background-color: #ffa200;
      }

      .public {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        color: #fff;
        font-size: 28rpx;
        text-align: center;
      }
    }
  }
}
</style>
    
      