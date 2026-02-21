<script setup lang="ts">
    import SurveyBrowser from './surveys/SurveyBrowser.vue';
    import SurveyCreator from './surveys/SurveyCreator.vue';
    import SurveyProperties from './surveys/SurveyProperties.vue';
    import {
        useSurveyStore
    } from '@/ts/stores/admin';

    // Using the store ID to switch panels feels hacky, but ig it works
    const surveyStore = useSurveyStore();
</script>

<template>
    <SurveyBrowser />
    <SurveyProperties v-if="surveyStore.selectedSurveyID !== -1" />
    <SurveyCreator v-else />
</template>

<style scoped lang="scss">

</style>
