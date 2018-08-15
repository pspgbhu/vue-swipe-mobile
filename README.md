# c-swipe

[![gzip](http://img.badgesize.io/https://unpkg.com/c-swipe/dist/swipe.js?compression=gzip&style=flat-square)](https://unpkg.com/c-swipe/dist/swipe.js)
[![npm package](https://img.shields.io/npm/v/c-swipe.svg?style=flat-square)](https://www.npmjs.org/package/c-swipe)
[![NPM downloads](http://img.shields.io/npm/dm/c-swipe.svg?style=flat-square)](https://npmjs.org/package/c-swipe)
[![GitHub issues](https://img.shields.io/github/issues/pspgbhu/vue-swipe-mobile.svg?style=flat-square)](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/issues)
[![Travis](https://img.shields.io/travis/pspgbhu/vue-swipe-mobile/master.svg?style=flat-square)](https://github.com/pspgbhu/vue-swipe-mobile)

[![NPM](https://nodei.co/npm/c-swipe.png)](https://nodei.co/npm/c-swipe/)

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

![c-swipe](https://raw.githubusercontent.com/pspgbhu/pspgbhu.github.io/master/assets/img/cswipe-demo.gif)

[中文文档](https://github.com/pspgbhu/Vue2-C-Swipe-Mobile/blob/master/README_CN.md)

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

*Or, you want import it by html tag*
```html
<link href="https://unpkg.com/c-swipe/dist/swipe.css" rel="stylesheet"></head>
<script type="text/javascript" src="https://unpkg.com/c-swipe/dist/swipe.js"></script>
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
| autoplayTime | Number | 0 | ms. Interval time of change card. The card will not auto change when this value is equal to 0
| speed | Number | 300 | ms, the spend time of change card.
|minMoveDistance | String | '20%' | Such as '20%', '80px'. The minimum distance that trigger to change card

## Methods

- **swipe.reset()**

The c-swipe internally recalculates the width of the Swipe and calculates the scroll distance based on the new width. This solves the problem that the c-swipe scroll distance is not correct after the container is resized.

Example:
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

    mounted() {
      // Avoid losing context
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener('resize', this.handleResize);
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },

    methods: {
      handleResize() {
        this.$refs.swipe.reset();
      },
    },

    // ...
    // ...
  }
</script>
```


## Preview

Scan the QR code below to preview

![c-swpie](https://user-images.githubusercontent.com/18444796/36627765-96ab7978-1982-11e8-862d-354cee86f89b.png)


## License

MIT
