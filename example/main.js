import Vue from 'vue';
import { Swipe, SwipeItem } from '../src/main';
// import { Swipe, SwipeItem } from 'c-swipe';
import App from './App';

// require('c-swipe/dist/swipe.css');

console.log(process.env);

/* eslint-disable global-require */
// if (process.env === 'test') {
//   require('c-swipe/dist/swipe.css');
// }

/* eslint-disable global-require */
// const Swipe = process.env === 'test'
//   ? require('../dist/swipe').Swipe
//   : require('../src/main').Swipe;
//
// const SwipeItem = process.env === 'test'
//   ? require('../dist/swipe').SwipeItem
//   : require('../src/main').SwipeItem;

Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
