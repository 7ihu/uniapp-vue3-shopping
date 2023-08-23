<template>
  <view class="order">
    <view v-for="(value, key) in cartList" :key="key" class="name">
      <view class="price">
        <text class="text">订单号：</text><text style="color: #95a5a6;">{{ key }}</text>
      </view>
      <view class="goods">
        <view v-for="(item, i) in value" :key="i" class="goods-info" @click="jumpGood(item.goods_id)">
          <image :src="item.goods_small_logo" mode="scaleToFill" />
          <view class="name">{{ item.goods_name }}</view>
          <view class="details">
            <text>x {{ item.goods_count }}</text>
            <text style="color: red;">￥{{ item.goods_price.toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState(['cartList']),
  },
  onLoad() {
  },
  methods: {
    jumpGood(id) {
      uni.navigateTo({ url: '/subpkg/goods_detail/goods_detail?goods_id=' + id })
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  .name {
    // display: flex;
    // 
    // justify-content: space-around;
    // align-items: center;
    padding: 10rpx 20rpx;

    .price {
      display: flex;
      align-items: center;
      overflow: hidden;
      font-size: 25rpx;
      color: #b2bec3;
      margin-bottom: 10rpx;

      .text {
        display: block;
        width: 130rpx;
      }
    }

    .goods {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      padding: 15rpx 10rpx;
      background-color: #f1f2f6;
      box-shadow: 0 5rpx 15rpx 5rpx rgb(206, 214, 224);

      .goods-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 140rpx;
        margin: 0 20rpx;
        padding: 5rpx 0 10rpx;

        .name {
          font-size: 25rpx;
        }

        .details {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-end;
          height: 140rpx;
          width: 200rpx;

          text {
            font-size: 25rpx;
          }
        }

        image {
          width: 230rpx;
          height: 140rpx;
          margin-bottom: 5rpx;
        }
      }
    }
  }
}
</style>
    
      