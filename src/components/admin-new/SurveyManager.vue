<script setup lang="ts">
    import SurveyBrowser from './surveys/SurveyBrowser.vue';
    import SurveyCreator from './surveys/SurveyCreator.vue';
    import SurveyMagicLinks from './surveys/SurveyMagicLinks.vue';
    import SurveyProperties from './surveys/SurveyProperties.vue';
    import {
        useRoute
    } from 'vue-router';

    const route = useRoute();
</script>

<template>
    <SurveyBrowser />
    <SurveyCreator v-if="route.path.endsWith( 'create-survey' )" />
    <SurveyMagicLinks v-else-if="route.path.endsWith( 'magiclinks' )" />
    <SurveyProperties v-else />
</template>