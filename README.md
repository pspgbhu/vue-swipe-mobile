# Vue-Cswipe.js

> A swipe (touch slide) component for Vue2.x in mobile device.

# Usage

register components:

```js
// main.js
// import Vue files into main.js
import Swipe from './components/vue-swipe.vue';
import SwipeItem from './components/vue-swipe.vue';

// register components
Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

```

Work on a Vue instance:

```html
<swipe v-model="index" style="text-align: center; line-height: 80px;">
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

| Option |  Description |
| ------ |    -------   |
| v-model| the value binding index of swipe-item, binding two way. |

# License

MIT
