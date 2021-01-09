<template>
  <div class="name">开怀</div>
  <router-view />
</template>
<script>
import Epub from 'epubjs'
global.ePub = Epub
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
export default {}
</script>
<style lang="scss">
</style>
