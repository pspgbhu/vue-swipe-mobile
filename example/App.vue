<template>
  <div>
    <header class="header">
      <h1 style="text-align: center">
        <a href="https://github.com/pspgbhu/Vue2-C-Swipe-Mobile">C-Swipe</a>
      </h1>
      <p style="text-align: center">基于 Vue 的轻量级轮播组件</p>
    </header>
    <div class="container">
      <h3>自动轮播</h3>
      <p>支持自定义轮播间隔时间，和切屏速度。</p>
      <swipe
        class="slide"
        :autoplayTime="4000"
        :speed="300"
      >
        <swipe-item v-for="i in itemNumber" :key="i" :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"></swipe-item>
      </swipe>

      <h3>Loop 模式</h3>
      <p>默认 Loop 开启</p>
      <swipe
        class="slide"
      >
        <swipe-item v-for="i in itemNumber" :key="i" :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"></swipe-item>
      </swipe>
      <p>关闭 Loop</p>
      <swipe
        class="slide"
        :loop="false"
      >
        <swipe-item v-for="i in itemNumber" :key="i" :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"></swipe-item>
      </swipe>

      <h3>双向绑定数据</h3>
      <p>通过 v-model 双向绑定了轮播图的索引。轮播图自动切换时会因此 v-model 绑定的值的改变，同时也可以通过改变 v-model 的赋值来改变轮播图的索引。</p>
      <p>下面两个按钮显式的改变了 v-model 的值</p>
      <button class="btn" @click="TwowayIndex = TwowayIndex <= 0 ? 5 : TwowayIndex - 1">后退</button>
      <button class="btn" @click="TwowayIndex = TwowayIndex >= 5 ? 0 : TwowayIndex + 1">前进</button>
      <span>当前卡片索引 {{ TwowayIndex }}</span>
      <swipe
        class="slide"
        v-model="TwowayIndex"
      >
        <swipe-item v-for="i in itemNumber" :key="i" :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"></swipe-item>
      </swipe>

      <h3>动态改变配置属性</h3>
      <p>充分发挥了响应式数据的特性，组件随时会根据配置 props 的改变而改变自身的表现</p>
      <button @click="isLoop = !isLoop">{{isLoop ? '关闭 Loop 模式' : '开启 Loop 模式'}}</button>
      <button @click="autoplay = autoplay ? 0 : 3000">{{autoplay ? '关闭自动轮播' : '开启自动轮播'}}</button>
      <button @click="pagination = !pagination">{{pagination ? '移除导航器' : '添加导航器'}}</button>
      <swipe
        class="slide"
        :loop="isLoop"
        :autoplayTime="autoplay"
        :pagination="pagination"
      >
        <swipe-item v-for="i in itemNumber" :key="i" :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"></swipe-item>
      </swipe>

      <h3>异步添加轮播图</h3>
      <button @click="itemAsync += 1">添加一个卡片</button>
      <button @click="decreaseHandler">减少一张卡片</button>
      <swipe
        class="slide"
        ref="swipeAsync"
      >
        <swipe-item
          v-for="i in itemAsync"
          :key="i"
          :class="`bg${i >= 6 ? (i % 6 || 6) : i}`"
        ></swipe-item>
      </swipe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemNumber: 6,
      TwowayIndex: 0,
      isLoop: true,
      pagination: true,
      autoplay: 0,
      itemAsync: 6,
    };
  },

  mounted() {
    // 该轮播组件也支持异步渲染
    setTimeout(() => {
      this.item = 10;
    }, 6000);
  },

  methods: {
    decreaseHandler() {
      this.itemAsync = this.itemAsync > 1 ? this.itemAsync - 1 : 1;
      // 避免删除卡片后，镜头落在轮播图外
      this.index5 = this.index5 >= this.itemAsync ? this.itemAsync - 1 : this.index5;
      // 删除卡片后，需要在 $nextTick 下手动调用 组件下的 reset 方法
      this.$nextTick(() => {
        this.$refs.swipeAsync.reset();
      });
    },
  },
};
</script>

<style lang="css">
  body {
    font-family: "myriad-pro","Myriad Pro","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
  h1 a {
    color: #333;
    text-decoration: none;
  }
  .header {
  }
  .container {
    margin-top: 50px;
  }
  .slide{
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    width: 100%;
    height: 200px;
    margin-bottom: 50px;
    margin-top: 10px;
  }
  .bg1 {
    background: url(http://img4.imgtn.bdimg.com/it/u=520678929,593190335&fm=214&gp=0.jpg) no-repeat center center / cover
  }
  .bg2 {
    background: url(http://img1.imgtn.bdimg.com/it/u=1471716942,4094675927&fm=26&gp=0.jpg) no-repeat center center / cover
  }
  .bg3 {
    background: url(http://img2.imgtn.bdimg.com/it/u=597587581,3468678967&fm=26&gp=0.jpg) no-repeat center center / cover
  }
  .bg4 {
    background: url(http://img3.imgtn.bdimg.com/it/u=2678501919,2198932864&fm=26&gp=0.jpg) no-repeat center center / cover
  }
  .bg5 {
    background: url(http://img3.imgtn.bdimg.com/it/u=1572897637,4138220730&fm=26&gp=0.jpg) no-repeat center center / cover
  }
  .bg6 {
    background: url(http://img1.imgtn.bdimg.com/it/u=2512132337,2443093068&fm=26&gp=0.jpg) no-repeat center center / cover
  }
  .slide .blue {
    background: #4ff
  }
  .slide .c-slide-pagination-item.active{
    background-color: #fff;
  }
  button {
    padding: 4px 8px;
    background: lightgray;
  }
</style>
