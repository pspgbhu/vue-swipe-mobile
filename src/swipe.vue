<template>
  <div class="c-swipe">
    <div
      class="c-swipe-wrapper"
      ref="wrapper"
      @touchstart="handleTouchstart"
      @touchend="handleTouchend"
      @touchcancel="handleTouchend"
    >
      <slot></slot>
    </div>
    <div v-if="pagination" class="c-swipe-pagination">
      <div class="c-swipe-pagination-bar">
        <i v-for="item in length" :class="['c-swipe-pagination-item', item - 1 === insideValue ? 'active': '']" :key="item"></i>
      </div>
    </div>
  </div>
</template>

<script>
// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

const passive = supportsPassive ? { passive: true } : false;

export default {
  name: 'swipe',

  data() {
    return {
      insideValue: this.value,
      pages: [], // cards dom list
      width: 0,
      length: 0,
      inited: false,

      startx: 0,
      translatex: 0,
      moveDistance: 0,
    };
  },

  props: {
    value: {
      type: Number,
      default: 0,
    },
    pagination: {   // 默认导航器
      type: Boolean,
      default: true,
    },
    time: {       // 自动轮播时间间隔
      type: Number,
      default: 0,
    },
    loop: {   // 循环滑动
      type: Boolean,
      default: true,
    },
    minMoveDistance: {  // 成功触发切换 item 的最小滑动距离
      type: String,
      default: '20%',
    },
    quickTouchTime: {  // 快速滑动时只要距离大于 10px 便可以触发滑动
      type: Number,
      default: 150,
    },
    follow: {   // 卡片是否跟随指尖移动而滑动
      type: Boolean,
      default: true,
    },
    free: {     // 自由滑动模式 NOT OPEN
      type: Boolean,
      default: false,
    },
    speed: {    // 切换屏幕的速度
      type: Number,
      default: 300,
    },
    flexible: {  // 卡片拉倒底部后是否能拉出底色
      type: Boolean,
      default: false,
    },
  },

  watch: {
    insideValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },

    value(val) {
      this.insideValue = val;
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.initDatas();   // 初始化部分 datas
      this.initStyle();

      if (this.inited) return;
      this.inited = true;
    },

    initDatas() {
      const style = getComputedStyle(this.$el, false).width;

      this.width = parseInt(style, 10);
      this.length = this.pages.length;
      this.pages = this.$slots.default
        .filter(vm => vm.elm.classList.contains('c-swipe-item'))
        .map(vm => vm.elm);
    },

    initStyle() {
    },

    handleTouchstart(e) {
      this.startx = e.touches[0].pageX;
      this.$refs.wrapper.addEventListener('touchmove', this.handleTouchmove, passive);
    },

    handleTouchend(e) {
      this.translatex += this.moveDistance;
      this.$refs.wrapper.removeEventListener('touchmove', this.handleTouchmove, passive);
    },

    handleTouchmove(e) {
      this.moveDistance = e.touches[0].pageX - this.startx;
      this.setTranslate(this.translatex + this.moveDistance);
    },

    /**
    *  惰性函数，设置 dom 的 translate 值
    *  @param  {dom}             el       进行变换的元素
    *  @param  {number, string}  trans    进行变换的值
    */
    setTranslate(d) {
      if ('transform' in document.documentElement.style) {
        this.setTranslate = transform;
        this.setTranslate(d);
      } else {
        this.setTranslate = webkitTransform;
        this.setTranslate(d);
      }
      function transform(d) {
        this.$refs.wrapper.style.transform = `translate3d(${d}px, 0, 0)`;
        this.$refs.wrapper.style.transform = `webkikTranslate3d(${d}px, 0, 0)`;
      }
      function webkitTransform(el, d) {
        this.$refs.wrapper.style.webkitTransform = `translate3d(${d}px, 0, 0)`;
        this.$refs.wrapper.style.webkitTransform = `webkitTranslate3d(${d}px, 0, 0)`;
      }
    },
  },
};
</script>

<style lang="postcss">
  .c-swipe{
    overflow: hidden;
  }

  .c-swipe-wrapper{
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .c-swipe-item{
    width: 100%;
    height: 100%;
    flex: none;
  }

  .c-swipe-pagination{
    position: relative;
    height: 0;
  }

  .c-swipe-pagination-bar{
    position: absolute;
    left: 0;
    right: 0;
    top: -12px;
    bottom: 0;
    height: 4px;

    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .c-swipe-pagination-item{
    display: block;
    width: 8px;
    height: 4px;
    border-radius: 3px;
    background-color: rgb(181,181,181);
    margin: 0 3px;
    transition: all .1s;
  }
  .c-swipe-pagination-item.active{
    width: 20px;
    background-color: rgb(72,163,241);
  }
</style>
