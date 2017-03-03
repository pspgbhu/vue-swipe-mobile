# Vue2-C-Swipe Mobile

> A swipe (touch slide) component for Vue2.x in mobile device.
> Only support touch event now.

> 一个简单的移动端卡片滑动组件，适用于Vue2.x

# Install
`npm install c-swipe --save`

# Usage

register components:

```js
// main.js

// import c-swipe files into main.js
import swipe from 'c-swipe';

// register components
Vue.use(swipe);

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

| Option | Type | Defalut  | Description |
| ------ | ---- | -------- | ----------- |
| v-model| Number | 0 |The value binding index of swipe-item, binding two way. |
| pagination | Boolean | true |If need default pagination. If you want to customize pagination, the value of v-model will help you make sure which item is showing. |

# Preview
Use the phone to scan the lower pattern for preview.

用手机扫描下方二维码进行预览

![c-swpie](https://pspgbhu.github.io/assets/img/c-swipe.png)

# License

MIT
