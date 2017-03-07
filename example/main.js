import Vue from 'vue';
import App from './App';
import dist from '../dist/swipe.js'
import { Swipe, SwipeItem } from '../src/main.js';

Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
