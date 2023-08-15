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
    return {
      n: 3,
      timer: null
    };
  },
  computed: {
    ...mapState(['cart', 'token']),
    ...mapGetters(['addstr', 'sumPrice', 'selectAll', 'checkedCount'])
  },
  methods: {
    ...mapMutations(['cancelState', 'updatecart', 'delcart']),
    cancelAll() {
      if (this.selectAll) {
        this.cancelState(true)
      } else {
        this.cancelState(false)
      }
    },
    balance() {
      // 先判断是否勾选了要结算的商品
      if (this.checkedCount === 0) return uni.$showMsg('请选择要结算的商品！')
      // 再判断用户是否选择了收货地址
      if (!this.addstr) return uni.$showMsg('请选择收货地址！')
      // 最后判断用户是否登录了
      if (!this.token) {
        uni.$showMsg(this.n + ' 秒后跳转登录页', 1000, 'loading')
        this.timer = setInterval(() => {
          this.n--
          uni.$showMsg(this.n + ' 秒后跳转登录页', 2000, 'loading')
          if (this.n <= 0) {
            clearInterval(this.timer)
            return uni.switchTab({ url: '/pages/my/my' })
          }
        }, 1000)
        return
      }
      // 实现微信支付功能
      this.payOrder()
    },
    // 微信支付
    async payOrder() {
      // 创建订单,发起请求创建订单
      // const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', {
      //   // 开发期间，注释掉真实的订单价格，
      //   order_price: this.sumPrice,
      //   consignee_addr: this.addstr,
      //   goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
      // })
      // if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
      // 得到服务器响应的“订单编号”,发起请求获取订单的支付信息
      // const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: res.message.order_number })
      // 预付订单生成失败
      // if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
      // 得到订单支付相关的必要参数,调用 uni.requestPayment() 发起微信支付

      // const pay = await uni.requestPayment(res2.message.pay)
      // 未完成支付
      // if (err) return uni.$showMsg('订单未支付！')
      // 完成了支付，进一步查询支付的结果
      // const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
      // 检测到订单未支付
      // if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
      // 检测到订单支付完成
      if (!this.token) {
        uni.$showMsg('订单支付失败', 1500, 'error');
        uni.showModal({
          title: '提示',
          content: '是否清除购物车商品？',
          success: (res) => {
            if (res.confirm) {
              this.delcart()
            }
          }
        })
        return
      }
      uni.$showMsg('支付完成', 1500, 'success');
      this.updatecart()
      return uni.navigateTo({ url: '/subpkg/orderForm/orderForm' })
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
    
      