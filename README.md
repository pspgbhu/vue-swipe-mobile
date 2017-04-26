# Vue2-C-Swipe Mobile

[![npm package](https://img.shields.io/npm/v/c-swipe.svg?style=flat-square)](https://www.npmjs.org/package/c-swipe)
[![NPM downloads](http://img.shields.io/npm/dm/c-swipe.svg?style=flat-square)](https://npmjs.org/package/c-swipe)
[![GitHub issues](https://img.shields.io/github/issues/pspgbhu/Vue2-C-Swipe-Mobile.svg)]()
[![Travis](https://travis-ci.org/pspgbhu/Vue2-C-Swipe-Mobile.svg?branch=master)]()

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

---

## [中文文档](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/blob/master/README_CN.md)


## Install
`npm install c-swipe --save`

## Usage

register components:

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

Use in `.vue` files.

```html
<swipe v-model="index" style="text-align: center; line-height: 80px; height: 100px;">
  <swipe-item style="height: 100px;">item1</swipe-item>
  <swipe-item style="height: 100px;">item2</swipe-item>
  <swipe-item style="height: 100px;">item3</swipe-item>
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

*Or, you want import it by html tag*
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



## Options

| Option | Type | Defalut  | Description |
| ------ | ---- | -------- | ----------- |
| v-model| Number | 0 |The value binding index of swipe-item |
| pagination | Boolean | true |If need default pagination.|
| infinity | Boolean | true | infinite loop |
| time | Number | 0 | ms, interval of change card. The card will not auto change when this value is equal to 0

## Preview
To scan the lower pattern for preview.

![c-swpie](https://pspgbhu.github.io/assets/img/c-swipe.png)

# License

MIT
