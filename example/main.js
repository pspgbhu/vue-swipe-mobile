import Vue from 'vue';
import App from './App';

import Swipe from '../src/swipe';
import SwipeItem from '../src/swipe-item';

Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
