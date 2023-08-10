<template>
  <view>{{ query }}</view>
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
    console.log(this.query)
  }
}
</script>

<style lang="scss" scoped></style>
    
      