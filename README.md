# Vue2-C-Swipe Mobile

[![npm package](https://img.shields.io/npm/v/c-swipe.svg?style=flat-square)](https://www.npmjs.org/package/c-swipe)
[![NPM downloads](http://img.shields.io/npm/dm/c-swipe.svg?style=flat-square)](https://npmjs.org/package/c-swipe)
[![GitHub issues](https://img.shields.io/github/issues/pspgbhu/vue-swipe-mobile.svg)](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/issues)
[![Travis](https://travis-ci.org/pspgbhu/Vue2-C-Swipe-Mobile.svg?branch=master)](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile)

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

![c-swipe](https://raw.githubusercontent.com/pspgbhu/pspgbhu.github.io/master/assets/img/cswipe-demo.gif)

---


## [中文文档](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/blob/master/README_CN.md)


## Install
`npm install c-swipe --save`

## Usage

register components:

```js
// main.js

// import c-swipe files into main.js
import 'c-swipe/dist/swipe.css';
import { Swipe, SwipeItem } from 'c-swipe';

// global register components
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
var vueSwipe = swipe.Swipe;
var vueSwipeItem = swipe.SwipeItem;

new Vue({
  el: 'body',
  // register components
  components: {
    'swipe': vueSwipe,
    'swipe-item': vueSwipeItem
  }
  // ...
  // ...
});
```



## Options

| Option | Type | Defalut  | Description |
| ------ | ---- | -------- | ----------- |
| v-model| Number | 0 |The value binding index of swipe-item |
| pagination | Boolean | true |If need default pagination.|
| loop | Boolean | true | loop move |
| autoplayTime | Number | 0 | ms, interval time of change card. The card will not auto change when this value is equal to 0
| speed | Number | 300 | ms, the spend time of change card.
|minMoveDistance | String | '20%' | If to pass a percent just like '20%', the minimum distance that trigger to change card is 20% of the card's width. Or to pass a number such as '80', the minimum distance that trigger to change page is 80px.


## Preview
To scan the lower pattern for preview.

![c-swpie](https://user-images.githubusercontent.com/18444796/36627765-96ab7978-1982-11e8-862d-354cee86f89b.png)

# License

MIT
