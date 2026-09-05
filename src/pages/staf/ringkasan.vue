<template>
  <RingkasanSambutan
    judul="Ringkasan Staf"
    deskripsi="Halaman pendaratan peran staf. Isi dengan ringkasan pekerjaan yang paling sering dibuka peran ini."
  />
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'], roles: ['staf'] })
</script>
