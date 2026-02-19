<script setup lang="ts">
    import {
        ref
    } from 'vue';
    import {
        listSurveys
    } from '@/ts/surveys';
    import testData from '@/ts/dev/SurveyTesData.json';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import { useSurveyStore } from '@/ts/stores/admin';

    const surveyStore = useSurveyStore();
    const loading = ref( false );
    const notifications = useNotification();
    const devMode = import.meta.env.VITE_DEV_MODE;

    const reloadFromServer = async () => {
        if ( devMode ) return useTestData();

        loading.value = true;

        try {
            surveyStore.setSurveys( await listSurveys() );
        } catch ( e ) {
            console.debug( e );
            notifications.notify( {
                'text': 'Failed to load ',
                'type': 'error',
                'title': 'Survey listing'
            } );
        }

        loading.value = false;
    };

    const useTestData = () => {
        loading.value = true;
        surveyStore.setSurveys( testData.list );
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
        loading.value = false;
    };

    const selectSurvey = ( surveyId: number ) => {
        surveyStore.setSurveyID( surveyId );
    };

    const addSurvey = () => {
        surveyStore.selectedSurveyID = -1;
    };

    reloadFromServer();
</script>

<template>
    <div class="list">
        <div class="top-bar">
            <h2 class="title">
                Surveys
            </h2>
            <div class="bar-buttons">
                <span>
                    <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="reloadFromServer"></i>
                </span>
                <span>
                    <i class="fa-lg fa-solid fa-plus add-icon" @click="addSurvey"></i>
                </span>
            </div>
        </div>
        <div class="survey-list">
            <table v-if="surveyStore.surveys.length > 0">
                <thead>
                    <tr>
                        <th class="survey-name">
                            Name
                        </th>
                        <th class="survey-user-count">
                            Users
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="survey, index in surveyStore.surveys"
                        :key="survey.id"
                        :class="index === surveyStore.selectedSurveyID ? 'selected' : ''"
                        @click="selectSurvey( index )"
                    >
                        <td class="survey-name">
                            {{ survey.title }}
                        </td>
                        <td>
                            {{ survey.userIds?.length }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="placeholder">
                <p>No surveys available yet</p>
                <button class="button primary" @click="addSurvey">
                    <i class="fa-solid fa-plus"></i>
                    Add survey
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

.list {
    height: 85vh;

    padding-right: 1rem;
    margin-right: 2rem;

    border-style: solid;
    border-color: var(--theme-bg-3-shade);
    border-width: 0px 2px 0px 0px;

    >.survey-list {
        background-color: var(--theme-bg-1);
        padding: 10px 20px;

        max-height: 70vh;
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
    }
}

</style>