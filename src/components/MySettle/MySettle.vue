<template>
  <view class="settle">
    <view class="my-settle" v-if="cart.length !== 0">
      <!-- 全选区域 -->
      <label class="radio" @click="cancelAll">
        <radio color="#C00000" :checked="!selectAll" /><text>全选</text>
      </label>

      <!-- 合计区域 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{ sumPrice.toFixed(2) }}</text>
      </view>

      <!-- 结算按钮 -->
      <view class="btn-settle" @click="balance">结算({{ checkedCount }})</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: "MySettle",
  data() {
    return {};
  },
  computed: {
    ...mapState(['cart','aHeight']),
    ...mapGetters(['sumPrice', 'selectAll', 'checkedCount'])
  },
  methods: {
    ...mapMutations(['cancelState']),
    cancelAll() {
      if (this.selectAll) {
        this.cancelState(true)
      } else {
        this.cancelState(false)
      }
    },
    balance() {
      console.log(this.sumPrice, !this.selectAll, this.checkedCount);
    }
  }
}
</script>

<style lang="scss" scoped>
.settle {
  .my-settle {
    /* 底部固定定位 */
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 90rpx;
    padding-left: 10rpx;
    font-size: 30rpx;
    // 将背景色从 cyan 改为 white
    background-color: white;
    border-top: 1px solid #efefef;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      height: 90rpx;
      min-width: 200rpx;
      background-color: #c00000;
      color: white;
      line-height: 90rpx;
      text-align: center;
    }
  }
}
</style>
    
      