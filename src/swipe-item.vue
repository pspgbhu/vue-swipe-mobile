<template lang="html">
  <div class="c-swipe-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swipe-item',
}
</script>

<style lang="css">
.c-swipe-item{
  width: 100%;
  flex-shrink: 0;
}
</style>
