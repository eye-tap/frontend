<script setup lang="ts">
    import Sidebar from '@/components/admin-new/sidebar/Sidebar.vue';
    import StatusBar from '@/components/StatusBar.vue';
    import SurveyManager from '@/components/admin-new/SurveyManager.vue';
    import TextManager from '@/components/admin-new/TextManager.vue';
    import { useSurveyStore } from '@/ts/stores/admin';

    const surveyStore = useSurveyStore();
</script>

<template>
    <StatusBar
        class="top-bar"
        :show-account="true"
        :show-theme-picker="true"
        page-title="Admin Panel"
        logo-click-target="/app"
    /> 
    <div class="admin">
        <Sidebar />
        <div class="content-wrapper">
            <SurveyManager v-if="surveyStore.panelMode === 'surveys' || surveyStore.panelMode === 'surveys-create'" />
            <TextManager v-else-if="surveyStore.panelMode === 'texts'" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-wrapper {
    display: grid;
    grid-template-columns: max(30vw, 500px) auto;
}

.top-bar {
    height: 8vh;
    width: 100vw;
    top: 0;
    left: 0;
    position: fixed;
    background-color: var( --theme-bg-2 );
    box-shadow: 10px 10px 30px var(--theme-bg-1-shade);
}

.admin  {
    display: grid;
    grid-template-columns: 275px auto;
    height: 90vh;
    margin-top: 10vh;
}

</style>