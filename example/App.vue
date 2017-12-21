<template lang="html">
  <div class="">
    <swipe
      class="slide"
      v-model="index"
      :autoplayTime="5000"
      :loop="false"
      ref="swiper"
    >
      <swipe-item v-for="i in item" :class="`item${i}`" style="">number{{ number + i }}</swipe-item>
    </swipe>
    <button @click="handleClick">Click Me!</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      item: 5,
      number: 0,
    };
  },

  mounted() {
    // 改轮播组件也支持异步渲染
    setTimeout(() => {
      this.item = 10;
    }, 4000);
  },

  methods: {
    handleClick() {
      this.number += 1;
    },
  },
};
</script>

<style lang="css">
  *{
    margin: 0;
    padding: 0;
  }
  .slide{
    text-align: center;
    margin-top: 100px;
    line-height: 200px;
    font-size: 24px;
    width: 100%;
    height: 200px;
  }
  .item1{
    height: 200px;
    background: #9f0
  }
  .item2{
    height: 200px;
    background: #f6c
  }
  .item3{
    height: 200px;
    background: #33f
  }
  .item4{
    height: 200px;
    background: #c8e
  }
  .item5{
    height: 200px;
    background: #3ee
  }
  .slide .c-slide-pagination-item.active{
    background-color: #fff;
  }
</style>
