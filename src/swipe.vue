<template>
  <div class="c-swipe">
    <div class="c-swipe-wrapper">
      <slot></slot>
    </div>
    <div v-if="pagination" class="c-swipe-pagination">
      <div class="c-swipe-pagination-bar">
        <i v-for="item in length" :class="['c-swipe-pagination-item', item - 1 === insideValue ? 'active': '']"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'swipe',

  data() {
    return {
      ele: null,  // wrapper dom
      pages: null, // cards dom list
      width: 0,
      length: 0,
      distance: 0,
      touchstartTime: 0,
      translate: 0,
      insideValue: this.value,
      changing: false,
      auto: false, // 区分是自动滑动 还是手动滑动
      forward: 'next',
      moveForward: null,
      changeForward: null,
      interval: null,
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
    minMoveDistance: {
      type: Number,
      default: 60, // 成功触发切换 item 的最小滑动距离
    },
    quickTouch: {
      type: Number,
      default: 150,
    },
    follow: {   // 卡片是否跟随指尖移动而滑动ß
      type: Boolean,
      default: true,
    },
    free: {     // 自由滑动模式
      type: Boolean,
      default: false,
    },
  },

  computed: {
  },

  watch: {
    insideValue(val) {
      this.$emit('input', val);
    },

    value(val) {
      if (val === this.insideValue) return;
      this.changePage(val);
    },
  },

  mounted() {
    this.$init();
  },

  beforeDestroy() {
    clearInterval(this.time);
  },

  methods: {
    $init() {
      clearInterval(this.interval);

      // wrapper dom
      this.ele = this.$el.getElementsByClassName('c-swipe-wrapper')[0];

      // cards dom list
      this.pages = this.$el.getElementsByClassName('c-swipe-item');

      // 缓存 page 的个数
      this.length = this.pages.length;

      // 缓存 wrapper 的 width。
      this.initWidth();

      // 初始化 active 的 卡片
      this.pages[this.insideValue].classList.add('active');

      // 初始卡片位置
      this.translate = -(this.width * this.insideValue);
      this.setTranslate(this.ele, this.translate);

      // 执行核心函数
      this.core();

      // 自动轮播
      this.autoChange(this.time);
    },

    $clearAuto() {
      clearInterval(this.interval);
    },

    initWidth() {
      const style = getComputedStyle(this.$el, false).width;
      this.width = parseInt(style, 10);
    },

    core() {
      const that = this;

      let touchStartX = 0;
      let touchStartY = 0;
      let moveDistance = 0;
      let moveDistanceY = 0;
      let startTranslateX = 0;
      let inindex = 0;
      let touchStartTime = 0;
      let canMove = true;
      let firstMove = true;


      this.$el.addEventListener('touchstart', startHandle);
      this.$el.addEventListener('touchmove', moveHandle);
      this.$el.addEventListener('touchend', endHandle);
      this.$el.addEventListener('touchcancel', endHandle);

      function startHandle(e) {

        // 清零
        moveDistance = 0;
        moveDistanceY = 0;

        // 记录start时间
        touchStartTime = new Date().getTime();

        // 记录初始坐标
        touchStartX = e.targetTouches[0].pageX;
        touchStartY = e.targetTouches[0].pageY;

        // 记录开始滑动时的 translate 的值
        startTranslateX = that.translate;


        canMove = true;
        firstMove = true;
      }

      function moveHandle(e) {
        // 计算 X 轴移动距离
        moveDistance = e.targetTouches[0].pageX - touchStartX;

        // first move
        if (firstMove) {

          // 计算 Y 轴移动距离
          moveDistanceY = e.targetTouches[0].pageY - touchStartY;

          // 垂直滑动屏幕
          if (Math.abs(moveDistance) < Math.abs(moveDistanceY)) {
            canMove = false;
          }

          firstMove = false;
        }

        // 是否水平滑动
        if (!canMove) {
          return;
        }

        // 主要是用来防止无意间的上下滑动
        e.preventDefault();

        // 手指右划 👉

        // follow
        if (that.follow) {
          const distance = startTranslateX + moveDistance;
          that.doTranslate(that.ele, distance);
        }
      }

      function endHandle(e) {
        that.translate = startTranslateX + moveDistance;


        // reset all variables
        firstMove = true;
        canMove = true;
      }
    },

    /**
     *  切换页面
     */

    changePage(index, forward = this.changeForward) {

    },

    move(el, dstce) {

    },


    doTranslate(el, trans) {
      console.log(el);
      this.setTranslate(el, trans);
    },

    /**
    *  惰性函数，设置 dom 的 translate 值
    *  @param  {dom}             el       进行变换的元素
    *  @param  {number, string}  trans    进行变换的值
    */

    setTranslate(el, trans) {
      if ('transform' in el.style) {
        this.doTranslate = transform;
        this.doTranslate(el, trans);

      } else {
        this.doTranslate = webkitTransform;
        this.doTranslate(el, trans);
      }

      function transform(el, trans) {
        console.log('normal');
        el.style.transform = `translate3d(${trans}px, 0, 0)`;
        el.style.transform = `webkikTranslate3d(${trans}px, 0, 0)`;
      }

      function webkitTransform(el, trans) {
        console.log('sub');
        el.style.webkitTransform = `translate3d(${trans}px, 0, 0)`;
        el.style.webkitTransform = `webkitTranslate3d(${trans}px, 0, 0)`;
      }
    },

    /**
     *  添加和删除过渡效果
     *  @param  {Array} args 需要添加过渡动画的元素数组
     */

    duration(args) {

    },

    /**
     *  Auto change cards
     *  @param  {Number} time The interval time of change cards.
     */

    autoChange(time) {

      if (time === 0) {
        return;
      }
      console.log('lala');
    },
  },
};
</script>

<style lang="css">
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
