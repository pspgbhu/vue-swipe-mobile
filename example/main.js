import Vue from 'vue';
import { Swipe, SwipeItem } from '../src/main';
import App from './App';

Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
