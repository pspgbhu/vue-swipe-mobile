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
      insideValue: this.value,
      length: 0,
      minMoveDistance: 60, // 成功触发切换 item 的最小滑动距离，会在 mounted 后动态更新
    };
  },

  props: {
    value: {
      type: Number,
      required: false,
      default: 0,
    },
    pagination: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  watch: {

  },

  mounted() {
    // 缓存 dom
    this.ele = this.$el;

    // 缓存 pages
    this.pages = this.$children.map(val => val.$el);

    // 缓存 page 的个数
    this.length = this.pages.length;

    // 缓存 wapper 的 width。
    this.$reload();

    // 初始化 active 的 卡片
    this.pages[this.insideValue].classList.add('active');

    // 执行核心函数
    this.core();
  },

  methods: {
    $reload() {
      const style = getComputedStyle(this.ele, false).width;
      this.width = parseInt(style, 10);

      // 初始化 minMoveDistance 最小触发距离
      this.minMoveDistance = this.width / 5.5 < 100
      ? this.width / 5.5
      : 100;
    },

    core() {
      // TODO
      // 1. 快速滑动
      // 2. 上下滑动

      const that = this;
      let touchstartX = 0;
      let touchstartY = 0;
      let distance = 0;
      let touchstartTime = 0;
      let touchendTime = 0;
      let isFirstMove = true; // flag
      let canMove = true; // flag
      let changing = false; // flag

      that.pages.forEach((val, index) => {
        // 单张卡片私有属性
        val.moveTranslate = 0;
        val.dataset.index = index;

        val.addEventListener('touchstart', handleStart);
        val.addEventListener('touchmove', handleMove);
        val.addEventListener('touchend', handleEnd);
      });


      function handleStart(e) {
        if (changing) return;

        // 初始化 flag
        isFirstMove = true;

        // 记录初始坐标
        touchstartX = e.targetTouches[0].pageX;
        touchstartY = e.targetTouches[0].pageY;

        // 记录开始时间
        touchstartTime = new Date().getTime();
      }

      function handleMove(e) {
        if (changing) return;

        // 计算 X 轴移动距离
        distance = e.targetTouches[0].pageX - touchstartX;

        // 判断是上下滑动还是左右滑动
        if (isFirstMove) {

          // 计算 Y 轴移动距离
          const distanceY = e.targetTouches[0].pageY - touchstartY;

          // 垂直滑动屏幕
          if (Math.abs(distance) < Math.abs(distanceY)) {
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

        // 左极限
        if (this.dataset.index == 0 && distance > 0) {
          return;

        // 右极限
      } else if (this.dataset.index == that.length - 1 && distance < 0) {
          return;
        }

        // 开始滑动
        move(this, distance);
      }

      function handleEnd(e) {
        if (changing) return;

        // 禁止左右滑动
        if (!canMove) {
          canMove = true;
          return;
        }

        // 标记
        changing = true;

        touchendTime = new Date().getTime();

        // 快速滑动
        if ( 100 < touchendTime - touchstartTime < 300) {

          if (distance > 0 && that.insideValue > 0) {
            changePage(that.insideValue - 1);

          } else if (distance < 0 && that.insideValue < that.length - 1){

            changePage(that.insideValue + 1);
          }

        // 普通滑动
        } else {

          // prev
          if (distance > that.minMoveDistance && that.insideValue > 0) {
            changePage(that.insideValue - 1);

            // next
          } else if (distance < -that.minMoveDistance && that.insideValue < that.length - 1) {
            changePage(that.insideValue + 1);

            // stay
          } else if (
            (distance > 0 && that.insideValue > 0) ||
            (distance < 0 && that.insideValue < that.length - 1)) {
              changePage(that.insideValue);
          }
        }

        // 全局distance 归 0;
        distance = 0;
        isFirstMove = true;
      }

      function move(el, dstce) {

        el.moveTranslate = dstce;
        // 当前卡片移动
        doTranslate(el, dstce);

        // 关心隔壁的卡片的位移
        const index = el.dataset.index;
        const prevTrans = dstce - that.width;
        const nextTrans = that.width + dstce;
        let forward = null;

        // 向右滑动 prev
        if (index > 0 && dstce > 0) {
          doTranslate(that.pages[index - 1], prevTrans);

          // 左边卡片露出后，切换为右边卡片露出，保证左边卡片在正确的位置停留
          if (forward === 'next' && index < that.length) {
            doTranslate(that.pages[parseInt(index) + 1], that.width);
          }
          forward = 'prev';
        }

        // 向左滑动 next
        if (index < that.length && dstce < 0) {
          doTranslate(that.pages[parseInt(index) + 1], nextTrans);

          // 左右切换滑动方向时，保证另外一方的卡片在正确的位置停留
          if (forward === 'prev' && index > 0) {
            doTranslate(that.pages[index - 1], -that.width);
          }
          forward = 'next';
        }
      }

      function doTranslate(el, trans) {
        el.style.transform = `translate3d(${trans}px, 0, 0)`;
        el.style.webkitTransform = `translate3d(${trans}px, 0, 0)`;
      }

      function changePage(index) {

        let forward = null;
        // 判断方向
        switch(true) {
          case (index > that.insideValue):
            forward = 'next';
            break;
          case (index < that.insideValue):
            forward = 'prev';
            break;
          case (index == that.insideValue):
            forward = 'stay';
            break;
        }
        console.log(forward);

        // 根据滚动方向不同，产生不同的行为
        if (forward === 'next') {
          // 添加过渡效果
          duration(index, index - 1);

          // 执行动画
          doTranslate(that.pages[index], 0);
          doTranslate(that.pages[parseInt(index) - 1], -that.width);

        } else if (forward === 'prev') {
          // 添加过渡效果
          duration(index, parseInt(index) + 1);

          // 执行动画
          doTranslate(that.pages[index], 0);
          doTranslate(that.pages[parseInt(index) + 1], that.width);

        } else if (forward === 'stay') {
          if (distance > 0) {
            // 添加过渡效果
            duration(index, index - 1);

            // 执行动画
            doTranslate(that.pages[index], 0);
            doTranslate(that.pages[parseInt(index) - 1], -that.width);

          } else if (distance < 0) {
            // 添加过渡效果
            duration(index, parseInt(index) + 1);

            // 执行动画
            doTranslate(that.pages[index], 0);
            doTranslate(that.pages[parseInt(index) + 1], that.width);
          }
        } else {
          changing = false;
        }

        // 同步 vue 数据
        that.insideValue = index;
      }

      function duration(...args) {
        // 添加过渡效果
        args.forEach(val => {
          that.pages[val].style.transitionDuration = '300ms';

          setTimeout(() => {
            that.pages[val].style.transitionDuration = '0ms';

            changing = false;
          }, 300)
        });
      }

    },
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
    transform: translate3d(-100%, 0, 0);
    position: absolute;

    &.active{
      transform: translate3d(0 ,0 ,0);
    }
  }

  .c-swipe-pagination{
    position: relative;
    height: 0;

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
  }

  .c-swipe-pagination-item{
    display: block;
    width: 8px;
    height: 4px;
    border-radius: 3px;
    background-color: rgb(181,181,181);
    margin: 0 3px;
    transition: all .1s;

    &.active{
      width: 20px;
      background-color: rgb(72,163,241);
    }
  }
</style>
