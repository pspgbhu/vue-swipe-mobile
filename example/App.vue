<template lang="html">
  <swipe v-model="index" class="slide">
    <swipe-item class="item1" style="">item1</swipe-item>
    <swipe-item class="item2" style="">item2</swipe-item>
    <swipe-item class="item3" style="">item3</swipe-item>
  </swipe>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
    };
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
  .slide .c-slide-pagination-item.active{
    background-color: #fff;
  }
</style>
