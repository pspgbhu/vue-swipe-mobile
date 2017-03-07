<template lang="html">
  <div class="">
    <swipe v-model="index" class="slide" :time="3000">
      <swipe-item v-for="i in item" :class="`item${i}`" style="">item{{ i }}</swipe-item>
    </swipe>
    <button id="button" type="button" name="button">button</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 1,
      item: 0,
    };
  },

  mounted() {
    document.getElementById('button').onclick = () => {
      this.index = this.index === 2 ? 0 : this.index + 1;
    }
    setTimeout(() => {
      this.item = 3
    }, 500)
  }
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
