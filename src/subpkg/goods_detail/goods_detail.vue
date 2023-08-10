<template>
  <view>{{ query }}</view>
</template>

<script>
export default {
  data() {
    return {
      query: 1
    };
  },
  onLoad(options) {
    // this.query = options
    console.log(options)
  }
}
</script>

<style lang="scss" scoped></style>
    
      