<script setup lang="ts">
    import type {
        ShallowReadingSessionDto
    } from '@/types/dtos/ShallowReadingSessionDto';
    import {
        listReadingSessions
    } from '@/ts/surveys';
    import testData from '@/ts/dev/TextTestData.json';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useStatusStore
    } from '@/ts/stores/status';
    import {
        useSurveyStore
    } from '@/ts/stores/admin';
    import { RouterLink } from 'vue-router';

    interface Text {
        'sessions': ShallowReadingSessionDto[];
        'id': number;
        'title': string;
        'selected': boolean[];
    }

    const surveyStore = useSurveyStore();
    const notifications = useNotification();
    const status = useStatusStore();

    const loadTexts = async () => {
        if ( status.devMode ) return useTestData();

        const sessions = await listReadingSessions();
        const t: {
            [key: number]: Text
        } = {};

        for ( let i = 0; i < sessions.length; i++ ) {
            const session = sessions[ i ]!;

            if ( !t[ session.textId! ] ) {
                t[ session.textId! ] = {
                    'sessions': [ session ],
                    'selected': [ false ],
                    'id': session.textId!,
                    'title': session.textTitle!
                };
            } else {
                const text = t[ session.textId! ]!;

                text.selected.push( false );
                text.sessions.push( session );
            }
        }

        const data = Object.values( t );

        for ( let i = 0; i < data.length; i++ ) {
            data[ i ]!.sessions.sort( ( a, b ) => {
                return a.reader! - b.reader!;
            } );
        }

        surveyStore.setTexts( data );
    };

    const useTestData = () => {
        const list: Text[] = testData.list;

        surveyStore.setTexts( list );
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
    };

    loadTexts();
</script>

<template>
    <div class="list">
        <div class="top-bar">
            <h2 class="title">
                Texts
            </h2>
            <div class="bar-buttons">
                <span>
                    <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="loadTexts"></i>
                </span>
                <RouterLink to="texts-upload">
                    <span>
                        <i class="fa-lg fa-solid fa-plus add-icon"></i>
                    </span>
                </RouterLink>
            </div>
        </div>
        <div class="survey-list">
            <table v-if="surveyStore.texts.length > 0">
                <thead>
                    <tr>
                        <th class="survey-name">
                            Name
                        </th>
                        <th>
                            Readers
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="text, id in surveyStore.texts"
                        :key="id"
                    >
                        <td class="survey-name">
                            {{ text.title }}
                        </td>
                        <td>
                            {{ text.sessions.length }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="placeholder">
                <p>No texts available yet</p>
                <button class="button primary">
                    <i class="fa-solid fa-plus"></i>
                    Add Text
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

    td {
        cursor: default;
    }

    >.survey-list {
        background-color: var(--theme-bg-1);
        padding: 10px 20px;

        max-height: 70vh;
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
    }
}
</style>
