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
      transitionTimeout: null,
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
      default: false,
    },
    minMoveDistance: {
      type: String,
      default: '20%', // 成功触发切换 item 的最小滑动距离
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
  },

  computed: {
    insideMinMoveDistance() {
      const minMoveDistance = this.minMoveDistance;

      // percent
      if (minMoveDistance.indexOf('%') > -1) {
        const percent = minMoveDistance.split('%')[0] * 0.01;
        return this.width * percent;

      // number px
      }

      return this.minMoveDistance * 1;
    },
  },

  watch: {
    insideValue(val) {
      this.$emit('input', val);
      this.changePage(val);
    },

    value(val) {
      if (val === this.insideValue) {
        return;
      }
      this.insideValue = val;
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

      // 初始卡片位置
      this.translate = -(this.width * this.insideValue);
      this.setTranslate(this.translate);

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
          that.setTranslate(distance);
        }
      }

      function endHandle(e) {

        // reset all variables
        firstMove = true;
        canMove = true;

        const touchEndTime = new Date().getTime();

        // Dont less than 10px
        if (Math.abs(moveDistance) < 10) {
          that.changePage(that.insideValue);
          return;
        }

        // It isn't quick slide and less than minimum move distance
        if (
          (touchEndTime - touchStartTime) > that.quickTouchTime &&
          Math.abs(moveDistance) < Math.abs(that.insideMinMoveDistance)
        ) {

          that.changePage(that.insideValue);
          return;
        }

        // quick slide
        if (
          (touchEndTime - touchStartTime) < that.quickTouchTime
        ) {

          // succeed in sliding to right prev
          if (
            moveDistance > 0 &&
            that.insideValue > 0
          ) {
            console.log(31);
            that.insideValue -= 1;
            return;
          }

          // succeed in sliding to left next
          if (
            moveDistance < 0 &&
            that.insideValue < that.length - 1
          ) {
            console.log(32);
            that.insideValue += 1;
            return;
          }

          that.changePage(that.insideValue);
          return;
        }

        // normal slide
        // succeed in sliding to right prev
        if (
          moveDistance > 0 &&
          that.insideValue > 0
        ) {
          that.insideValue -= 1;
          return;
        }

        // succeed in sliding to right prev
        if (
          moveDistance < 0 &&
          that.insideValue < that.length - 1
        ) {
          that.insideValue += 1;
          return;
        }

        // failed to slide
        that.changePage(that.insideValue);
      }
    },

    move(el, dstce) {

    },


    // doTranslate(trans) {
    //   this.setTranslate(trans);
    // },

    /**
    *  惰性函数，设置 dom 的 translate 值
    *  @param  {dom}             el       进行变换的元素
    *  @param  {number, string}  trans    进行变换的值
    */

    setTranslate(trans) {
      if ('transform' in this.ele.style) {
        this.setTranslate = transform;
        this.setTranslate(trans);

      } else {
        this.setTranslate = webkitTransform;
        this.setTranslate(trans);
      }

      function transform(trans) {
        this.ele.style.transform = `translate3d(${trans}px, 0, 0)`;
        this.ele.style.transform = `webkikTranslate3d(${trans}px, 0, 0)`;
      }

      function webkitTransform(el, trans) {
        this.ele.style.webkitTransform = `translate3d(${trans}px, 0, 0)`;
        this.ele.style.webkitTransform = `webkitTranslate3d(${trans}px, 0, 0)`;
      }
    },

    /**
     *  切换页面
     */

    changePage(index) {
      this.insideValue = index;
      this.duration();
      this.translate = -(this.width * this.insideValue);
      this.setTranslate(this.translate);
    },

    /**
     *  添加和删除过渡效果
     */

    duration() {
      clearTimeout(this.transitionTimeout);
      this.ele.style.transitionDuration = `${this.speed}ms`;

      this.transitionTimeout = setTimeout(() => {
        this.ele.style.transitionDuration = '';
      }, this.speed);
    },

    /**
     *  Auto change cards
     *  @param  {Number} time The interval time of change cards.
     */

    autoChange(time) {

      // if (time === 0) {
      //   return;
      // }
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

    transition-timing-function: ease-out;
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
