<script setup lang="ts">
    import {
        createSurvey, listReadingSessions
    } from '@/ts/surveys';
    import type {
        ShallowReadingSessionDto
    } from '@/types/dtos/ShallowReadingSessionDto';
    import SwitchOption from '@/components/settings/SwitchOption.vue';
import { adminBaseRoute } from '../adminConfig';
    import inputFilter from '@/ts/util/inputFilter';
    import {
        ref
    } from 'vue';
    import testData from '@/ts/dev/TextTestData.json';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
    import {
        useStatusStore
    } from '@/ts/stores/status';
    import {
        useSurveyStore
    } from '@/ts/stores/admin';

    interface Text {
        'sessions': ShallowReadingSessionDto[];
        'id': number;
        'title': string;
        'selected': boolean[];
    }

    const router = useRouter();
    const notifications = useNotification();
    const surveyStore = useSurveyStore();
    const status = useStatusStore();
    const title = ref( '' );
    const desc = ref( '' );
    const userCount = ref( null );

    const dismiss = () => {
        surveyStore.selectedSurveyIndex = -2;
    };

    const selectText = ( index: number ) => {
        surveyStore.setTextIndex( index );
    };

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

    const toggleSelectAllForText = ( textIdx: number, newState: boolean ) => {
        const text = surveyStore.texts[ textIdx ]!;

        if ( !newState ) {
            text.selected = text.selected.map( () => false );
        } else {
            text.selected = text.selected.map( () => true );
        }
    };

    const save = () => {
        if ( !userCount.value || userCount.value < 1 ) {
            return notifications.notify( {
                'text': 'User count too low',
                'type': 'error',
                'title': 'Survey creation'
            } );
        } else if ( title.value.length < 3 ) {
            return notifications.notify( {
                'text': 'Title too short',
                'type': 'error',
                'title': 'Survey creation'
            } );
        } else if ( desc.value.length < 5 ) {
            return notifications.notify( {
                'text': 'Description too short',
                'type': 'error',
                'title': 'Survey creation'
            } );
        } else if ( !surveyStore.texts.map( text => text.selected.reduce( ( res, val ) => res || val ) )
            .reduce( ( res, val ) => res || val ) ) {
            return notifications.notify( {
                'text': 'Please select at least one reader from one text',
                'type': 'error',
                'title': 'Survey creation'
            } );
        }

        createSurvey(
            userCount.value!,
            title.value,
            desc.value,
            surveyStore.texts.map( val => val.sessions.map( val => val.id! ).filter( ( _v, idx ) => val.selected[ idx ] ) ).flat()
        ).then( links => {
            surveyStore.setLinks( links );
            router.push( adminBaseRoute + '/magiclinks' );
        } );
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

    surveyStore.unselectSurvey();
    loadTexts();
</script>

<template>
    <div class="survey-create">
        <div class="top-bar">
            <p class="title">
                Create Survey
            </p>
            <div class="bar-buttons">
                <span>
                    <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="loadTexts"></i>
                </span>
            </div>
        </div>

        <div class="content">
            <p class="subtitle">
                METADATA
            </p>
            <div>
                <input
                    v-model="title"
                    type="text"
                    placeholder="Survey Title"
                >
                <input
                    v-model.number="userCount"
                    type="text"
                    placeholder="Number of users"
                    @keydown="inputFilter.numeric()"
                >
            </div>
            <textarea
                v-model="desc"
                type="text"
                placeholder="Description"
                rows="4"
            ></textarea>

            <p class="subtitle">
                TEXTS
            </p>
            <div class="multi-table-wrapper">
                <div
                    v-if="surveyStore.texts.length > 0"
                    class="left-table-wrapper"
                >
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th class="left-th">
                                    Select All
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="text, index in surveyStore.texts"
                                :key="index"
                                :class="index === surveyStore.selectedTextIndex ? 'selected' : ''"
                            >
                                <td
                                    class="left-td"
                                    @click="() => selectText( index )"
                                >
                                    {{ text.title }}
                                </td>
                                <td class="select-all">
                                    <div>
                                        <SwitchOption text="" @change="newState => toggleSelectAllForText( index, newState )" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="placeholder">
                    Please upload a text
                </div>

                <div v-if="surveyStore.selectedTextIndex !== -1" class="right-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Reader</th>
                                <th>Selected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="session, index in surveyStore.getSelectedText?.sessions"
                                :key="index"
                            >
                                <td class="left-td">
                                    {{ session.reader }}
                                </td>
                                <td class="select-all">
                                    <div>
                                        <SwitchOption v-model="surveyStore.getSelectedText!.selected[ index ]" text="" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="placeholder">
                    <p>Please select a text</p>
                </div>
            </div>
            <button class="button primary" @click="save">
                Save
            </button>
            <button class="button secondary" @click="dismiss">
                Back
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

.survey-create {
    // Mainly for wide displays
    .top-bar {
        justify-content: left;
    }

    .content {
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
        max-height: 80vh;

        >button {
            margin: 1rem;
            width: 200px;
        }

        .multi-table-wrapper {
            width: 50vw;
            display: grid;
            grid-template-columns: 50% 50%;
            margin-left: 1rem;

            .left-table-wrapper {
                height: 40vh;
                margin-right: 1rem;
                padding: 0px 1rem;

                overflow-y: auto;
                scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
            }

            .right-table-wrapper {
                height: 40vh;
                padding: 0px 1rem;

                overflow-y: auto;
                scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
            }

            .left-td {
                padding-left: 1rem;
            }

            .select-all {
                width: 20%;
                text-align: right;
                padding: 8px;

                >div {
                    padding-top: 8px;
                    padding-bottom: 8px;
                    background-color: var(--theme-bg-1);
                    border-radius: 10px;
                    margin-right: 10px;

                    >label {
                        margin-left: 0px;
                    }
                }
            }
        }
    }
}
</style>
