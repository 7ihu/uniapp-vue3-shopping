import { createStore } from 'vuex'

export default createStore({
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state() {
    return {
      // 购物车的数组，用来存储购物车中每个商品的信息对象
      // 每个商品的信息对象，都包含如下 6 个属性：
      // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
      cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
      todayId: '',
      frequency: 0,
       // 收货地址
      address: JSON.parse(uni.getStorageSync('address') || '{}'),
    }
  },

  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)

      if (!findResult) {
        // 如果购物车中没有这件商品，则直接 push
        state.cart.push(goods)
      } else {
        if (findResult.goods_count >= 100) return uni.$showMsg('商品库存不足')
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('saveToStorage')
    }, // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    showHideId(state, id) {
      state.todayId = id
    },
    frequencyId(state) {
      state.frequency++
    },
    frequencynum(state) {
      if (state.frequency) {
        state.frequency = 0
        state.todayId = ''
      }
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, id) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find((x) => x.goods_id === id)
      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = !findResult.goods_state
        // 持久化存储到本地
        this.commit('saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find((x) => x.goods_id === goods.id)

      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.count
        // 持久化存储到本地
        this.commit('saveToStorage')
      }
    },
    delGoodsInfo(state) {
      const findResult = state.cart.filter((x) => x.goods_state !== true)
      if (findResult) {
        if (state.cart.length === 0) return uni.$showMsg('购物车无商品')
        // 更新对应商品的数量
        state.cart = findResult
        // 持久化存储到本地
        this.commit('saveToStorage')
      }
    },

    // 更新收货地址
    updateAddress(state, res) {
      state.address = res

      // 2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
      this.commit('saveAddressToStorage')
    },
    // 1. 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    cancelState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach((item) => (item.goods_state = newState))
      // 持久化存储到本地
      this.commit('saveToStorage')
    },
  },

  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      return state.cart.reduce((start, item) => {
        return start + item.goods_count
      }, 0)
    },
    addstr(state) {
      if (!state.address.provinceName) return ''

      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter((item) => item.goods_state).reduce((total, items) => (total += items.goods_count), 0)
    },
    // 选中商品全选
    selectAll(state) {
      return state.cart.filter((item) => item.goods_state === false).length > 0
    },
    // 选中商品总价
    sumPrice(state) {
      return state.cart.filter((item) => item.goods_state).reduce((sum, items) => sum + items.goods_count * items.goods_price, 0)
    },
  },
})
