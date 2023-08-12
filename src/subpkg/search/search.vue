<template>
  <view class="search">
    <view class="searchBox">
      <icon type="search" size="22" />
      <input type="text" v-model.trim="value" placeholder="请输入搜索内容" @input="inputValue" />
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="value !== '' && searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <view class="goods-right"><text>></text></view>
      </view>
    </view>
    <view class="history" v-else>
      <view class="setting">
        <text>搜索历史</text>
        <icon type="search" size="23" @click="delHistory" />
      </view>
      <view class="record">
        <text v-for="(item, i) in searchHistory" :key="i">{{ item }}</text>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      value: '',
      searchHistory: [],
      searchResults: []
    };
  },
  methods: {
    inputValue(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getSearch()
      }, 500)
    },
    async getSearch() {
      // 判断关键词是否为空
      if (this.value === '') return this.searchResults = []
      // 发起请求，获取搜索建议列表
      const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.value })
      if (res.meta.status !== 200) return uni.$showMsg()
      if (res.message.length === 0) uni.$showMsg('关键词不合法', 1500, 'error')
      this.searchResults = res.message
      this.saveSearchHistory();
    },

    // 保存搜索关键词为历史记录
    saveSearchHistory() {
      /***
        * 将 Array 数组转化为 Set 对象
        * 调用 Set 对象的 delete 方法，移除对应的元素
        * 调用 Set 对象的 add 方法，向 Set 中添加元素
        * 将 Set 对象转化为 Array 数组 将当前值在数组反转并赋值
        */
      const set = new Set(this.searchHistory)
      set.delete(this.value)
      set.add(this.value)
      this.searchHistory = Array.from(set).reverse()
      // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
      uni.setStorageSync('history', JSON.stringify(this.searchHistory))
    },

    // 清空搜索历史记录
    delHistory() {
      // 清空 data 中保存的搜索历史
      this.searchHistory = []
      // 清空本地存储中记录的搜索历史
      uni.setStorageSync('history', '[]')
    },


    // 点击跳转
    gotoDetail(id) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + id,
      })
    }
  },
  onLoad() {
    this.searchHistory = JSON.parse(uni.getStorageSync('history') || '[]')
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;

  .searchBox {
    position: sticky;
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120rpx;
    padding: 0 20rpx;
    background-color: #c00000;

    input {
      width: 100%;
      height: 60rpx;
      font-size: 28rpx;
      border-radius: 30rpx;
      padding: 0 15rpx 0 70rpx;
      background-color: #fff;
      border: 1px solid red;
    }

    icon {
      position: absolute;
      top: 40rpx;
      left: 32rpx;
      z-index: 999;
      // background-color: #fff;
    }
  }

  .history {
    .setting {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding: 0 20rpx;
      border-bottom: 1px solid lightgray;
    }

    .record {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-around;
      padding: 10rpx;

      text {
        margin: 10rpx;
        padding: 0 5rpx;
        background-color: rgba(241, 242, 246, 1);
      }
    }
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 10rpx;
      border-bottom: 1px solid #efefef;


      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        // margin-right: 3px;
      }

      .goods-right {
        width: 50rpx;
        text-align: right;
      }
    }
  }
}
</style>
    
      