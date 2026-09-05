<template><DaftarCatatan /></template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'], roles: ['staf'] })
import DaftarCatatan from '~/components/catatan/DaftarCatatan.vue'
</script>
