<template>
  <view class="order">
    <view v-for="(value, key) in cartList" :key="key" class="name">
      <view class="price">
        <text class="text">订单号：</text><text style="color: #95a5a6;">{{ key }}</text>
      </view>
      <view class="goods">
        <view v-for="(item, i) in value" :key="i" class="goods-info">
          <image :src="item.goods_small_logo" mode="scaleToFill" />
          <text style="font-size: 20rpx;color: red;">数量：{{ item.goods_count }}</text>
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
    console.log(this.cartList);
  },
  methods: {

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
      .text{
        display: block;
        width: 130rpx;
      }
    }

    .goods {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      align-items: center;
      padding: 15rpx 10rpx;
      background-color: #f1f2f6;
      box-shadow: 0 5rpx 15rpx 5rpx rgb(206, 214, 224);

      .goods-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 230rpx;

        image {
          width: 230rpx;
          height: 200rpx;
          margin-bottom: 5rpx;
        }
      }
    }
  }
}
</style>
    
      