<template>
  <div class="c-swipe">
    <div class="c-swipe-warpper">
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
      ele: {}, // 缓存 dom
      pages: [], // 缓存子元素 dom
      width: 0,
      length: 0,
      distance: 0,
      touchstartTime: 0,
      minMoveDistance: 60, // 成功触发切换 item 的最小滑动距离，会在 mounted 后动态更新
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
    pagination: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 0,
    },
    infinity: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    leftIndex() {
      return this.insideValue === 0 ? this.length - 1 : this.insideValue - 1; // 左边卡片的索引
    },
    rightIndex() {
      return this.insideValue === this.length - 1 ? 0 : this.insideValue + 1; // 右边卡片的索引
    },
  },

  watch: {
    insideValue(val) {
      this.$emit('input', val);
    },

    value(val) {
      if (val === this.insideValue) return;

      if (val === 0 && this.insideValue === this.length - 1) {
        this.changeForward = 'next';
      } else if (val === this.length - 1 && this.insideValue === 0 && this.length > 2) {
        this.changeForward = 'prev';
      } else if (val > this.insideValue) {
        this.changeForward = 'next';
      } else if (val < this.insideValue) {
        this.changeForward = 'prev';
      }

      this.changePage(val);
    },
  },

  methods: {
    $init() {
      clearInterval(this.interval);

      // 缓存 dom
      this.ele = this.$el;

      // 缓存 pages
      this.pages = this.$children.map(val => val.$el);

      // 缓存 page 的个数
      this.length = this.pages.length;

      // 缓存 wapper 的 width。
      this.initWidth();

      // 初始化 active 的 卡片
      this.pages[this.insideValue].classList.add('active');

      // 执行核心函数
      this.core();

      // 自动轮播
      this.autoChange(this.time);
    },

    $clearAuto() {
      clearInterval(this.interval);
    },

    initWidth() {
      const style = getComputedStyle(this.ele, false).width;
      this.width = parseInt(style, 10);

      // 初始化 minMoveDistance 最小触发距离
      this.minMoveDistance = this.width / 3 < 100
      ? this.width / 3
      : 100;
    },

    core() {
      // TODO
      // 1. 快速滑动
      // 2. 上下滑动
      const that = this;
      let touchstartX = 0;
      let touchstartY = 0;
      let touchendTime = 0;
      let isFirstMove = true; // flag
      let canMove = true; // flag
      let touching = false;

      that.pages.forEach((val, index) => {
        // 单张卡片私有属性
        val.moveTranslate = 0;
        val.dataset.index = index;

        val.addEventListener('touchstart', handleStart);
        val.addEventListener('touchmove', handleMove);
        val.addEventListener('touchend', handleEnd);
        val.addEventListener('touchcancel', handleEnd);
      });

      function handleStart(e) {
        if (that.changing) return;
        if (touching) return;
        touching = true;
        that.auto = false;

        // 初始化 flag
        isFirstMove = true;

        // 记录初始坐标
        touchstartX = e.targetTouches[0].pageX;
        touchstartY = e.targetTouches[0].pageY;

        // 记录开始时间
        that.touchstartTime = new Date().getTime();

        // clearInterval
        clearInterval(that.interval);
      }

      function handleMove(e) {
        if (that.changing) return;
        if (!touching) return;

        // 计算 X 轴移动距离
        that.distance = e.targetTouches[0].pageX - touchstartX;

        // 判断是上下滑动还是左右滑动
        if (isFirstMove) {

          // 计算 Y 轴移动距离
          const distanceY = e.targetTouches[0].pageY - touchstartY;

          // 垂直滑动屏幕
          if (Math.abs(that.distance) < Math.abs(distanceY)) {
            canMove = false;
          }
          isFirstMove = false;
        }

        // 不能左右滑动，返回
        if (!canMove) {
          return;
        }

        // 不能上下滑动
        e.preventDefault();

        // 关闭无限滚动
        if (!that.infinity) {
          // 左极限s
          if (this.dataset.index * 1 === 0 && that.distance > 0) {
            return;

            // 右极限
          } else if (this.dataset.index * 1 === that.length - 1 && that.distance < 0) {
            return;
          }
        }

        // 开始滑动
        that.move(this, that.distance);
      }

      function handleEnd(e) {
        if (!touching) return;
        touching = false;

        // 禁止左右滑动
        if (!canMove) {
          canMove = true;
          return;
        }
        if (that.changing) return;

        touchendTime = new Date().getTime();

        // 快速滑动
        if (touchendTime - that.touchstartTime > 100 && touchendTime - that.touchstartTime < 600) {

          // 设置 changeForward
          that.changeForward = that.distance > 0 ? 'prev' : 'next';

          // prev
          if (that.changeForward === 'prev') {

            if (!that.infinity && that.insideValue === 0) {
              // 关闭无限滚动
              return;
            }

            that.changePage(that.leftIndex);
          // next
          } else if (that.changeForward === 'next') {

            // 关闭无限滚动
            if (!that.infinity && that.insideValue === that.length - 1) {
              return;
            }

            // 正常滚动
            that.changePage(that.rightIndex);
          }

        // 普通滑动
        } else {

          // 设置 changeForward
          switch (true) {
            case (that.distance > that.minMoveDistance):
              that.changeForward = 'prev';
              break;
            case (that.distance < -that.minMoveDistance):
              that.changeForward = 'next';
              break;
            default:
              that.changeForward = 'stay';
          }

          // prev
          if (that.changeForward === 'prev') {

            // 关闭无限滚动
            if (!that.infinity && that.insideValue === 0) {
              return;
            }

            that.changePage(that.leftIndex);
          // next
          } else if (that.changeForward === 'next') {

            // 关闭无限滚动
            if (!that.infinity && that.insideValue === that.length - 1) {
              return;
            }

            that.changePage(that.rightIndex);
          // stay
          } else {
            that.changePage(that.insideValue);
          }
        }

        // 全局distance 归 0;
        that.distance = 0;
        isFirstMove = true;
        that.moveForward = null;

        // setInterval
        that.autoChange(that.time);
      }
    },

    /**
     *  切换页面
     */
    changePage(index, forward = this.changeForward) {
      const leftIndex = this.leftIndex;
      const rightIndex = this.rightIndex;

      // 根据滚动方向不同，产生不同的行为
      if (forward === 'next' || forward === 'prev') {
        const trans = forward === 'next' ? -this.width : this.width;
        // const trans = -this.width;

        // 添加过渡效果
        this.duration([index, this.insideValue]);

        // 执行动画
        this.doTranslate(this.pages[index], 0);
        this.doTranslate(this.pages[this.insideValue], trans);

      } else if (forward === 'stay') {

        if (this.distance > 0) {
          // 添加过渡效果
          this.duration([index, leftIndex]);

          // 执行动画
          this.doTranslate(this.pages[index], 0);
          this.doTranslate(this.pages[leftIndex], -this.width);

        } else if (this.distance < 0) {
          // 添加过渡效果
          this.duration([index, rightIndex]);

          // 执行动画
          this.doTranslate(this.pages[index], 0);
          this.doTranslate(this.pages[rightIndex], this.width);
        }

      } else {

        this.changing = false;
      }

      // 同步 vue 数据
      if (this.insideValue !== index) {
        this.pages[this.insideValue].classList.remove('active');
        this.pages[index].classList.add('active');
        this.insideValue = index;
      }
    },

    move(el, dstce) {
      //  当前卡片移动的距离
      el.moveTranslate = dstce;

      // 当前卡片移动
      this.doTranslate(el, dstce);

      // 关心隔壁的卡片的位移
      const index = this.insideValue; // 当前卡片的索引
      const leftIndex = this.leftIndex; // 左边卡片的索引
      const rightIndex = this.rightIndex; // 右边卡片的索引
      const prevTrans = dstce - this.width;
      const nextTrans = this.width + dstce;

      // 向右滑动 prev
      if (dstce > 0) {
        this.doTranslate(this.pages[leftIndex], prevTrans);

        // 右边卡片露出后，切换为左边卡片露出，保证右边卡片在正确的位置停留
        if (this.moveForward === 'next' && index < this.length) {
          this.doTranslate(this.pages[rightIndex], this.width);
        }
        this.moveForward = 'prev';
      }
      // 向左滑动 next
      if (dstce < 0) {
        this.doTranslate(this.pages[rightIndex], nextTrans);
        // 左边卡片露出后，切换为右边卡片露出，保证左边卡片在正确的位置停留
        if (this.moveForward === 'prev') {

          this.doTranslate(this.pages[leftIndex], -this.width);
        }
        this.moveForward = 'next';
      }
    },

    doTranslate(el, trans) {
      el.style.transform = `translate3d(${trans}px, 0, 0)`;
      el.style.webkitTransform = `translate3d(${trans}px, 0, 0)`;
    },

    duration(args) {
      const time = this.auto ? 400 : 300;
      this.changing = true;
      // 添加过渡效果
      args.forEach(val => {
        this.pages[val].style.transitionDuration = `${time}ms`;

        setTimeout(() => {
          this.pages[val].style.transitionDuration = '';
          this.pages[val].style.transform = '';
        }, time);
        setTimeout(() => {
          this.changing = false;
        }, time);
      });
    },

    autoChange(time) {
      if (time === 0) return;

      this.interval = setInterval(() => {
        this.auto = true;
        this.$emit('input', this.rightIndex);
      }, time);
    },
  },

  beforeDestroy() {
    clearInterval(this.time);
  },
};
</script>

<style lang="css">
  .c-swipe{
    overflow: hidden;
  }

  .c-swipe-warpper{
    height: 100%;
    display: flex;
    position: relative;
  }

  .c-swipe-item{
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    transform: translate3d(100%, 0, 0);
    position: absolute;

  }
  .c-swipe-item.active{
    transform: translate3d(0 ,0 ,0);
  }

  /*.c-swipe-item.active ~ .c-swipe-item{
    transform: translate3d(100%, 0, 0);
  }*/

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
