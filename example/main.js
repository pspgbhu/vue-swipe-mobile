import Vue from 'vue';
import App from './App';

require('../dist/swipe.css');
import Cswipe from '../dist/swipe.js';

Vue.use(Cswipe);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
