<template>
  <view>
    <view>{{ query?.query }}</view>
    <view>{{ query?.goods_id }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      query: {}
    };
  },
  onLoad(options) {
    this.query = options
    console.log(options)
  }
}
</script>

<style lang="scss" scoped></style>
    
      