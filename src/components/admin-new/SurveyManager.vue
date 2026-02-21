<script setup lang="ts">
    import SurveyBrowser from './surveys/SurveyBrowser.vue';
    import SurveyCreator from './surveys/SurveyCreator.vue';
    import SurveyProperties from './surveys/SurveyProperties.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
</script>

<template>
    <SurveyBrowser />
    <SurveyProperties v-if="!route.path.endsWith( 'create-survey' )" />
    <SurveyCreator v-else />
</template>