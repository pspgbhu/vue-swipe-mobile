import Swipe from './swipe.vue';
import SwipeItem from './swipe-item.vue';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  Vue.component(Swipe.name, Swipe);
  Vue.component(SwipeItem.name, SwipeItem);

  install.installed = true;
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {

  install(window.Vue);
};

const Cswipe = { install };

export default Cswipe;
