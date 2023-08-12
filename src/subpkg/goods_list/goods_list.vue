<template>
  <view class="goods">
    <view class="goods-list" v-if="flag">
      <block v-for="(goods, i) in goodsList" :key="i">
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id" class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <!-- 商品标题 -->
            <view class="goods-name">{{ goods.goods_name }}</view>
            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="goods-price">￥{{ goods.goods_price.toFixed(2) }}</view>
              <view class="goods-number">数量：<text class="goods-price">{{ goods.goods_number }}</text></view>
            </view>
          </view>
        </navigator>
      </block>
    </view>
    <view class="fail" :style="'height:' + availableHeight + 'px;line-height:' + availableHeight / 2 + 'px'" v-else>
      <rich-text style="font-size: 60rpx;" nodes="<h2>404 NotFound</h2>"></rich-text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      // 请求参数对象
      queryObj: {
        // 查询关键词
        query: '',
        // 商品分类Id
        goods_id: '',
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },
      flag: true,
      count: 0,
      total: 0,
      goodsList: [],
      // 是否正在请求数据
      isloading: false,
      availableHeight: 0
    };
  },
  onLoad(options) {
    this.availableHeight = uni.getSystemInfoSync().windowHeight
    this.queryObj.query = options.query || ''
    this.queryObj.goods_id = options.goods_id || ''
    this.getgoodsList()
  },
  methods: {
    async getgoodsList(cb) {
      this.isloading = true
      const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
      if (res.meta.status !== 200) return uni.$showMsg()
      this.isloading = false
      // 只要数据请求完毕，就立即按需调用 cb 回调函数
      cb && cb()
      this.goodsList = [...this.goodsList, ...res.message.goods]
      if (this.goodsList.length === 0) {
        uni.$showMsg()
        this.flag = false
      }
      this.total = res.message.total
    }
  },
  // 下拉刷新的事件
  onPullDownRefresh() {
    // 1. 重置关键数据
    this.queryObj.pagenum = Math.floor(Math.random() * this.total / 10) + 1
    this.total = 0
    this.count = 0
    this.isloading = false
    this.goodsList = []

    // 2. 重新发起请求
    this.getgoodsList(() => uni.stopPullDownRefresh())
  },
  // 触底的事件
  onReachBottom() {
    // 判断是否正在请求其它数据，如果是，则不发起额外的请求
    if (this.isloading) return
    if (this.count === 0) {
      this.queryObj.pagenum = 0, this.count = 1, this.goodsList = []
    }
    // 判断是否还有下一页数据
    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')

    // 让页码值自增 +1
    this.queryObj.pagenum += 1
    // 重新获取列表数据
    this.getgoodsList()
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;

    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
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

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }

      .goods-number {
        font-size: 12px;
        padding-right: 10rpx;
      }
    }
  }
}

.fail {
  width: 100%;
  text-align: center;
  color: red;
  background-image: url(https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png);
}
</style>
    
      