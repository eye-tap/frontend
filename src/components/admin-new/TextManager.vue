<script setup lang="ts">
    import TextBrowser from './texts/TextBrowser.vue';
    import TextUpload from './texts/TextUpload.vue';
    // import { useSurveyStore } from '@/ts/stores/admin';

    // Using the store ID to switch panels feels hacky, but ig it works
    // const surveyStore = useSurveyStore();
</script>

<template>
    <TextBrowser />
    <TextUpload />
</template>

<style scoped lang="scss">

</style>
