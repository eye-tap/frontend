<script setup lang="ts">
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';

    const pickSurvey = () => {
        useAnnotationSessionStore().surveyId = 1;
    };
</script>

<template>
    <div>
        <h1>Study picker</h1>
        <button @click="pickSurvey">
            Pick survey
        </button>
        <router-link to="/app/colab/session">
            To sessions
        </router-link>
    </div>
</template>
