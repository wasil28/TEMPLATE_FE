<template><DaftarCatatan /></template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'], roles: ['admin'] })
import DaftarCatatan from '~/components/catatan/DaftarCatatan.vue'
</script>
