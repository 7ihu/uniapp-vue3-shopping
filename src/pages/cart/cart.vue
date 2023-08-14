<template>
  <MyAddress></MyAddress>
  <view class="cart">
    <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <view class="cart-title-image">
        <!-- 左侧的图标 -->
        <image src="../../static/my-icons/cart-empty.png" mode="scaleToFill" />
        <!-- 描述文本 -->
        <text class="cart-title-text">购物车{{ showHide }}</text>
      </view>
      <view class="btn">
        <view><button size="mini" @click="delGoods">删除</button></view>
        <view v-if="true"><button size="mini" @click="returnBack">返回</button></view>
      </view>

    </view>
    <view class="goods-list">
      <block v-for="(goods, i) in cart" :key="i">
        <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left" @click="showClick(goods.goods_id)">
            <radio :checked="goods.goods_state" color="#C00000"></radio>
            <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <!-- 商品标题 -->
            <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id" class="goods-name">{{
              goods.goods_name }}</navigator>
            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="goods-price">￥{{ goods.goods_price.toFixed(2) }}</view>
              <view class="goods-number">
                <view @click="reduceCount(goods)">-</view>
                <text>{{ goods.goods_count }}</text>
                <view @click="addCount(goods)">+</view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default ({
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['cart', 'todayId', 'frequency']),
    ...mapGetters(['total'])
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    ...mapMutations(['addToCart', 'frequencyId', 'updateGoodsState', 'updateGoodsCount', 'delGoodsInfo']),
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2, // 索引
        text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      })
    },
    returnBack() {
      this.frequencyId()
      if (this.frequency >= 4) {
        return uni.switchTab({ url: '/pages/home/home' })
      }
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + this.todayId
      })
    },
    showClick(id) {
      this.updateGoodsState(id)
    },
    reduceCount(goods) {
      const count = goods.goods_count - 1
      if (count < 1) return uni.$showMsg('商品最少一件')
      this.updateGoodsCount({ id: goods.goods_id, count: count })
    },
    addCount(goods) {
      const count = goods.goods_count + 1
      if (count > 10) return uni.$showMsg('已选数量最大')
      this.updateGoodsCount({ id: goods.goods_id, count: count })
    },
    delGoods() {
      this.delGoodsInfo()
    }
  },

}) 
</script>

<style scoped lang="scss">
.cart {
  .cart-title {
    height: 60rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 15rpx 0 25rpx;
    border-bottom: 1px solid #efefef;

    .cart-title-image {
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 30rpx;

      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
    .btn{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 260rpx;
    }

    .cart-title-text {
      margin-left: 10rpx;
    }
  }

  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 5px;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        padding: 0 5rpx;
        margin-right: 20rpx;

        .goods-price {
          font-size: 16px;
          color: #c00000;
        }

        .goods-number {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 150rpx;
          height: 80rpx;
          font-size: 12px;

          view {
            width: 50rpx;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            background-color: #f8f8f8;
            border: 1px solid lightgray;
            border-radius: 15rpx;
          }
        }
      }
    }
  }
}
</style>