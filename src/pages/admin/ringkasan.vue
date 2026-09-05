<template>
  <RingkasanSambutan
    judul="Ringkasan Administrator"
    deskripsi="Utilitas sistem: pengguna dan hak aksesnya, peran, struktur menu, dan otorisasi per peran."
  />
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'], roles: ['admin'] })
</script>
