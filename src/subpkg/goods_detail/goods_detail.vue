<template>
  <view>{{ query.goods_id }}</view>
</template>

<script>
export default {
  data() {
    return {
      query: () => { }
    };
  },
  onLoad(options) {
    this.query = options
  }
}
</script>

<style lang="scss" scoped></style>
    
      