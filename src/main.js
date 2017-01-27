// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Swipe from './components/swipe';
import SwipeItem from './components/swipe-item';

Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
