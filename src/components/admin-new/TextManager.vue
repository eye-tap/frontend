<script setup lang="ts">
    import TextBrowser from './texts/TextBrowser.vue';
    import TextUpload from './texts/TextUpload.vue';
    import TextUploadOptions from './texts/TextUploadOptions.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
</script>

<template>
    <TextBrowser />
    <TextUploadOptions v-if="route.path.endsWith( 'options' )" />
    <TextUpload v-else />
</template>
