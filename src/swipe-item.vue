<template lang="html">
  <div class="c-slide-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swipe-item',
}
</script>

<style lang="css">
.c-slide-item{
  width: 100%;
  flex-shrink: 0;
}
</style>
