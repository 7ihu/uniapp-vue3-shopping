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
          <icon type="info" size="18" color="rgb(16, 174, 255)" v-if="flag"></icon>
          <icon type="success" size="18" v-else></icon>
          <text :style="flag ? '' : 'color:red'">收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详情信息 -->
    <view class="goods-image">
      <rich-text :nodes="goodsDetails.goods_introduce"></rich-text>
    </view>
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <view class="shop" @click="shop">
        <icon type="info" size="21" color="rgb(16, 174, 255)"></icon>
        <text>店铺</text>
      </view>
      <view class="cart" @click="cart">
        <icon type="info" size="21" color="rgb(16, 174, 255)"></icon>
        <text class="cartInfo">{{ addGoods.count }}</text>
        <text>购物车</text>
      </view>
      <view class="buy">
        <button class="addCart public" @click="addCart">加入购物车</button>
        <button class="buyNow public" @click="buy">立即购买</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      flag: true,
      goodsDetails: [],
      addGoods: {
        id: '',
        count: 0
      }
    };
  },
  onLoad(options) {
    this.getgoodsDetails(options.goods_id)
  },
  methods: {
    async getgoodsDetails(goods_id) {
      const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
      if (res.meta.status !== 200) return uni.$showMsg()
      // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
      // 为 data 中的数据赋值
      this.goodsDetails = res.message
      console.log(res.message);
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


















    // 点击购物车跳转
    cart() {
      uni.switchTab({ url: '/pages/cart/cart' })
    },
    // 点击加入购物车
    addCart(id) {
      if (this.addGoods.count >= 100) return;
      this.addGoods.id = this.goodsDetails.goods_id
      this.addGoods.count++
    }
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
        font-size: 22rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
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
    padding-bottom: 50px;
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
      font-size: 25rpx;
      height: 80rpx;
    }

    .cart {
      position: relative;

      .cartInfo {
        position: absolute;
        top: -3rpx;
        right: 1rpx;
        width: 30rpx;
        height: 30rpx;
        line-height: 35rpx;
        text-align: center;
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
    
      