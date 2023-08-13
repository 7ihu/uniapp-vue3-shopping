<template>
  <view class="cart">{{ total }}</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default ({
  data() {
    return {}
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['total'])
  },
  methods: {},

}) 
</script>

<style scoped></style>