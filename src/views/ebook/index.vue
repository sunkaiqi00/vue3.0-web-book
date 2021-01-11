<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookMenu from '../../components/ebook/EbookMenu.vue'
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
export default {
  name: 'Ebook',
  components: { EbookReader, EbookTitle, EbookMenu }
}
</script>

<style scoped>
</style>
