# C-Swipe Mobile

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

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
| v-model| Number. The value binding index of swipe-item, binding two way. |
| pagination | Boolean. If need default pagination. If you want to customize pagination, the value of v-model will help you make sure which item is showing. |

# License

MIT
