# c-swipe

[![npm package](https://img.shields.io/npm/v/c-swipe.svg)](https://www.npmjs.org/package/c-swipe)
[![NPM downloads](http://img.shields.io/npm/dm/c-swipe.svg)](https://npmjs.org/package/c-swipe)
[![GitHub issues](https://img.shields.io/github/issues/pspgbhu/vue-swipe-mobile.svg)](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/issues)
[![Travis](https://travis-ci.org/pspgbhu/vue-swipe-mobile.svg?branch=master)](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile)

[![NPM](https://nodei.co/npm/c-swipe.png)](https://nodei.co/npm/c-swipe/)

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

> 一个简单的移动端卡片滑动轮播组件，适用于Vue2.x

**c-swipe 2.0 全新归来。重写了全部的代码，更靠谱的质量，更优秀的性能**

![c-swipe](https://raw.githubusercontent.com/pspgbhu/pspgbhu.github.io/master/assets/img/cswipe-demo.gif)

[English Document](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/blob/master/README.md)

## 安装
`npm install c-swipe --save`

## 使用

注册组件

```js
// main.js

// 引入 c-swipe 主文件
import 'c-swipe/dist/swipe.css';
import { Swipe, SwipeItem } from 'c-swipe';

// 全局注册组件
Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);
```

在 `.vue` 单文件组件中使用:

```html
<swipe
  v-model="index"
  style="text-align: center; line-height: 80px; height: 100px; background: #42b983;"
>
  <swipe-item style="height: 100px; line-height: 100px">item1</swipe-item>
  <swipe-item style="height: 100px; line-height: 100px">item2</swipe-item>
  <swipe-item style="height: 100px; line-height: 100px">item3</swipe-item>
</swipe>
```

```js
new Vue({
  data: function () {
    return {
      index: 0, // two way
    };
  },
});
```

*或者，你想在 html 标签中直接引用*
```html
<link href="../node-modules/c-swipe/dist/swipe.css" rel="stylesheet"></head>
<script type="text/javascript" src="../node-modules/c-swipe/dist/swipe.js"></script>
```
```js
var vueSwipe = swipe.Swipe;
var vueSwipeItem = swipe.SwipeItem;

new Vue({
  el: 'body',
  // 注册组件
  components: {
    'swipe': vueSwipe,
    'swipe-item': vueSwipeItem
  },
  // ...
  // ...
});
```

## 配置

| 选项 | 类型 | 默认  | 描述 |
| ------ | ---- | -------- | ----------- |
| v-model| Number | 0 | 绑定了当前显示卡片的索引，该数据为双向绑定，可通过更改 v-model 的值直接更改当前显示卡片 |
| pagination | Boolean | true | 是否需要默认样式的导航器 |
| loop | Boolean | true | 循环切换 |
| autoplayTime | Number | 0 | 单位 ms，自动切换卡片的时间间隔，值为 0 时不自动切换 |
| speed | Number | 300 | 单位 ms, 切换卡片时的过渡效果的播放时长
| minMoveDistance | String | '20%' | 成功触发切换卡片事件的最小滑动距离，可以传入百分比，如 '20%'，或者传入具体像素距离，如 '80px'。

## 方法

- **swipe.reset()**

c-swipe 内部将重新计算 Swipe 的宽度，并根据新的宽度来计算滚屏的距离。这个可以解决容器重置大小后 c-swipe 滚屏距离不正确的问题。

例：
```jsx
<swipe ref="swipe">
  <swipe-item>item1</swipe-item>
  <swipe-item>item2</swipe-item>
  <swipe-item>item3</swipe-item>
</swipe>

<script>
  export default {
    // ...
    // ...

    handleResize() {
      this.$refs.swipe.reset();
    }

    mounted() {
      // 避免上下文丢失
      this.handleResize = this.handleResize.bind(this);

      window.addEventListener('resize', this.handleResize);
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    }

    // ...
    // ...
  }
</script>
```

## 预览

用手机扫描下方二维码进行预览

![c-swpie](https://user-images.githubusercontent.com/18444796/36627765-96ab7978-1982-11e8-862d-354cee86f89b.png)

## 反馈

如果你在使用中有任何疑问，遇见任何问题，或是有任何好的建议，都欢迎通过 issue 来反馈给我，我也一定会在第一时间答疑解惑，解决问题。

## License

MIT
