# Vue2-C-Swipe Mobile

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

> 一个简单的移动端卡片滑动轮播组件，适用于Vue2.x

# Install
`npm install c-swipe --save`

# Usage

注册组件

```js
// main.js

// import css file
require('c-swipe/dist/swipe.css');

// import c-swipe files into main.js
import { Swipe, SwipeItem } from 'c-swipe';

// register components
Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);
```

或直接通过标签引用

```html
<link href="../node-modules/c-swipe/dist/swipe.css" rel="stylesheet"></head>
<script type="text/javascript" src="../node-modules/c-swipe/dist/swipe.js"></script>
```
```js
const vueSwipe = swipe.Swipe;
const vueSwipeItem = swipe.SwipeItem;

new Vue({
  el: 'body',
  components: {
    'swipe': vueSwipe,
    'swipe-item': vueSwipeItem
  }
});

```


在Vue中使用:

```html
<swipe v-model="index" style="text-align: center; line-height: 80px; height: 100px;">
  <swipe-item style="height: 100px;">item1</swipe-item>
  <swipe-item style="height: 100px;">item2</swipe-item>
  <swipe-item style="height: 100px;">item3</swipe-item>
</swipe>
```

```js
new Vue({
  // ...
  // ...
  // ...
  data: function () {
    return {
      index: 0, // two way
    };
  },
});
```


# Options

| 选项 | 类型 | 默认  | 描述 |
| ------ | ---- | -------- | ----------- |
| v-model| Number | 0 | 绑定了当前显示卡片的索引，该数据为双向绑定，可通过更改 v-model 的值直接更改当前显示卡片 |
| pagination | Boolean | true |是否需要默认样式的导航器. 如果你需要自定义导航器, v-model 的值将会给你提供一定的帮助 |
| infinity | Boolean | true | 是否无限循环 |
| time | Number | 0 | 单位 ms，自动切换卡片的时间间隔，值为 0 时不自动切换 |

# Preview

用手机扫描下方二维码进行预览

![c-swpie](https://pspgbhu.github.io/assets/img/c-swipe.png)

# License

MIT
