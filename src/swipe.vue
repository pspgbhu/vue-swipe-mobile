<!--
slide 性能优化问题及总结：
1.
  问题：在手机上 touchend 事件触发后到下一帧渲染时的时间过长，造成直观上的卡顿。

  背景：slide 的滑动和 Vue 的 data 值高度耦合，同时还双向绑定了激活状态的索引，因此每次改变激活状态索引暨双向绑定的 value
       值的时候，都牵扯到大量的 vue 的内部计算。而 Vue 是异步执行 DOM 更新，只有在一个事件循环完成后才会去更新 Dom。

  方案：slide 滑动核心代码和 vue data数据解耦。同时为了保留双向绑定的特性，用到了 insideValue data值来同步激活索引，
       用 dataset.translatex 来同步滚动距离数据。

  结果：2.7 GHz Intel Core i5 Chrome DevTools Timeline 10 * slowdown：
       优化前：touchend事件触发后到下一帧渲染时的时间间隔 180ms
       优化后：touchend事件触发后到下一帧渲染时的时间间隔 40ms
 -->

<template>
  <div class="c-slide">
    <div class="c-slide-warpper">
      <slot></slot>
      <slot name="item" class="c-slide-item"></slot>

    </div>
    <div v-if="pagination" class="c-slide-pagination">
      <div class="c-slide-pagination-bar">
        <i v-for="item in length" :class="['c-slide-pagination-item', item - 1 === insideValue ? 'active': '']"></i>
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
    value(val) {

      // 此时 v-model 被从外部改变
      if (val !== this.insideValue) {
        this.insideValue = val;
        this.setTranslateXByInsideValue();
      }
    },

    insideValue(val) {

      this.$emit('input', val);
    },
  },

  mounted() {

    // 缓存dom节点
    this.ele = this.$el.getElementsByClassName('c-slide-warpper')[0];

    // 初始化 width，minMoveDistance
    this.resetPixel();

    // 设定初始 translateX 位置
    this.ele.dataset.translatex = -(this.width * this.length);

    // 初始化 item 长度
    this.length = this.$el.getElementsByClassName('c-slide-item').length;

    // 执行核心函数
    this.core();
  },

  methods: {
    resetPixel() {

      const style = getComputedStyle(this.$el, false).width;
      this.width = parseInt(style, 10);

      // 初始化 minMoveDistance 最小触发距离
      this.minMoveDistance = this.width / 5.5 < 100
      ? this.width / 5.5
      : 100;
    },

    core() {
      const that = this;
      const minMoveDistance = 60; // 成功触发切换 item 的最小滑动距离

      let translateX = this.ele.dataset.translatex * 1;
      let touchStartX = 0;
      let touchStartY = 0;
      let moveDistance = 0;
      let startTranslateX = 0;
      let inindex = 0;
      let canMove = true;
      let firstMove = true;

      const setTranslateX = 'webkitTransform' in that.ele.style
      ? setTranslateXnormal
      : setTranslateXsub;

      this.ele.addEventListener('touchstart', startHandle);
      this.ele.addEventListener('touchmove', moveHandle);
      this.ele.addEventListener('touchend', endHandle);
      this.ele.addEventListener('touchcancel', endHandle);

      function startHandle(e) {
        // 先同步函数内部的 translateX
        translateX = that.ele.dataset.translatex * 1;

        // 记录初始坐标
        touchStartX = e.targetTouches[0].pageX;
        touchStartY = e.targetTouches[0].pageY;

        // 记录 touchStart 时组件的 translatex 的值
        startTranslateX = translateX;

        // 取消过渡效果
        that.ele.style.transitionDuration = '0ms';

        canMove = true;
        firstMove = true;
      }

      function moveHandle(e) {

        // 计算 X 轴移动距离
        moveDistance = e.targetTouches[0].pageX - touchStartX;

        // 第一次触发touchmove
        if (firstMove) {
          // 计算 Y 轴移动距离
          const moveDistanceY = e.targetTouches[0].pageY - touchStartY;

          // 垂直滑动屏幕
          if (Math.abs(moveDistance) < Math.abs(moveDistanceY)) {

            canMove = false;
          }

          firstMove = false;
        }

        if (!canMove) {
          return;
        }

        // 主要是用来防止无意间的上下滑动
        e.preventDefault();

        // 判断最大值与最小值
        if (moveDistance > 0) {

          translateX = startTranslateX + moveDistance > 0
          ? 0
          : startTranslateX + moveDistance;

          setTranslateX(translateX);
        } else if (moveDistance < 0) {

          translateX = startTranslateX + moveDistance < -that.width * (that.length - 1)
          ? -that.width * (that.length - 1)
          : startTranslateX + moveDistance;

          setTranslateX(translateX);
        }
      }

      function endHandle(e) {
        // 禁止左右移动时
        if (!canMove) return;

        canMove = true;
        firstMove = true;

        if (Math.abs(moveDistance) > Math.abs(that.minMoveDistance)) {
          // 左滑 👈
          if (moveDistance > 0 && inindex > 0) {

            inindex -= 1;
            changeIndex(inindex);

          // 右滑 👉
          } else if (moveDistance <= 0 && inindex < that.length - 1) {

            inindex += 1;
            changeIndex(inindex);
          }

          return;
        }

        changeIndex(inindex);
      }

      function setTranslateXnormal(x) {
        that.ele.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      function setTranslateXsub(x) {
        that.ele.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
      }

      // 切换 slide 的 acitve index
      function changeIndex(index) {

        const trans = -(that.width * index);
        setTranslateX(trans);

        that.ele.style.transitionDuration = '300ms';

        that.ele.dataset.translatex = trans;

        setTimeout(() => {
          that.insideValue = index;
        }, 0);

        setTimeout(() => {
          that.ele.style.transitionDuration = '0ms';
        }, 300);
      }
    },

    setTranslateXByInsideValue() {
      const trans = -(this.width * this.insideValue);

      this.ele.style.transform = `translate3d(${trans}px, 0, 0)`;
      this.ele.style.webkitTransform = `translate3d(${trans}px, 0, 0)`;

      this.ele.style.transitionDuration = '300ms';
      setTimeout(() => {
        this.ele.style.transitionDuration = '0ms';
      }, 300);

      this.ele.dataset.translatex = trans;
    },
  },
};
</script>

<style lang="css">
  .c-slide{
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .c-slide-warpper{
    width: 100%;
    height: 100%;
    display: flex;
  }

  .c-slide-pagination{
    position: relative;
    height: 0;

    .c-slide-pagination-bar{
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

  .c-slide-pagination-item{
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
