import Vue from 'vue';
import App from './App';

import Cswipe from '../src/swipe.js';

Vue.use(Cswipe);

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
