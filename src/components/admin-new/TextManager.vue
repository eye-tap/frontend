<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import TextBrowser from './texts/TextBrowser.vue';
    import TextUpload from './texts/TextUpload.vue';
    import TextUploadOptions from './texts/TextUploadOptions.vue';

    const route = useRoute();
</script>

<template>
    <TextBrowser />
    <TextUploadOptions v-if="route.path.endsWith( 'options' )" />
    <TextUpload v-else />
</template>