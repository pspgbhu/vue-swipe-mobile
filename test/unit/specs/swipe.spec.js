import Vue from 'vue';
import Swipe from 'src/swipe';
import SwipeItem from 'src/swipe-item';

describe('swipe.vue', () => {
  const Ctor = Vue.extend();

  const vm = new Ctor({
    template: `
    <div class="">
      <swipe style="width: 50px; height: 50px;" v-model="value">
        <swipe-item v-for="i in item" style="">item{{ i }}</swipe-item>
      </swipe>
    </div>
    `,

    data() {
      return {
        value: 0,
        item: [0, 1, 2],
      };
    },

    components: {
      swipe: Swipe,
      'swipe-item': SwipeItem,
    },
  }).$mount();

  it('swipe init status', () => {
    expect(vm.value).to.be.equal(0);
  });
});
