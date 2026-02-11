<script setup lang="ts">
    import {
        type Ref,
        computed,
        ref,
        watch
    } from 'vue';
    import {
        createSurvey,
        listReadingSessions
    } from '@/ts/surveys';
    import type {
        ShallowReadingSessionDto
    } from '@/types/dtos/ShallowReadingSessionDto';
    import inputFilter from '@/ts/util/inputFilter';
    import {
        useNotification
    } from '@kyvg/vue3-notification';

    const dismiss = () => {
        show.value = false;
    };

    interface Text {
        'sessions': ShallowReadingSessionDto[];
        'id': number;
        'title': string;
        /**
         * Each element corresponds to an ID in the sessions
         */
        'selected': boolean[];
    }

    const show = defineModel<boolean>();
    const texts: Ref<Text[]> = ref( [] );
    const title = ref( '' );
    const desc = ref( '' );
    const userCount = ref( null );
    const notifications = useNotification();

    const isSelectOrUnselectAll = ( textIdx: number ) => {
        return computed( () => {
            return texts.value[ textIdx ]!.selected.reduce( ( res, val ) => res && val ) ? 'Deselect all' : 'Select all';
        } );
    };

    const loadTexts = async () => {
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

        texts.value = data;
    };

    const toggleSelectAllForText = ( textIdx: number ) => {
        const text = texts.value[ textIdx ]!;

        if ( text.selected.reduce( ( res, val ) => res && val ) ) {
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
        } else if ( !texts.value.map( text => text.selected.reduce( ( res, val ) => res || val ) ).reduce( ( res, val ) => res || val ) ) {
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
            texts.value.map( val => val.sessions.map( val => val.id! ).filter( ( _v, idx ) => val.selected[ idx ] ) ).flat()
        );
    };

    watch( show, val => {
        if ( val ) loadTexts();
    } );

    // TODO: Fix up design (it is quite horrible currently)
</script>

<template>
    <div v-if="show" class="create-survey">
        <div class="create-survey-box">
            <div class="top-bar">
                <h1>Create Survey</h1>
                <div>
                    <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="loadTexts()"></i>
                </div>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p>General</p>
                        <input
                            v-model="title"
                            type="text"
                            placeholder="Survey Title"
                        >
                        <textarea
                            v-model="desc"
                            type="text"
                            placeholder="Description"
                        ></textarea>
                        <input
                            v-model.number="userCount"
                            type="text"
                            placeholder="Number of users"
                            @keydown="inputFilter.numeric()"
                        >
                    </div>

                    <div class="options-section">
                        <p>Texts to include</p>
                        <table v-if="texts.length > 0">
                            <thead>
                                <tr>
                                    <td>Title</td>
                                    <td>Include?</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="text, index in texts" :key="index">
                                    <td>{{ text.title }}</td>
                                    <td>
                                        <!-- TODO: Make this look good. My idea would be to make it collapsible -->
                                        <button @click="toggleSelectAllForText( index )">
                                            {{ isSelectOrUnselectAll( index ) }}
                                        </button>
                                        <div v-for="session, idx in text.sessions" :key="idx">
                                            <input v-model="text.selected[ idx ]" type="checkbox">
                                            {{ session.reader }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <p>No texts available</p>
                        </div>
                        <button class="button primary" @click="save">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.create-survey {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    z-index: 1;     // To properly black out all of the Editor

    >.create-survey-box {
        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >.fa-solid {
                font-size: 1.5rem;
                cursor: pointer;
            }

            >h1 {
                font-size: 2rem;
            }

        }

        width: 30rem;
        height: max-content;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;

        .options-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 30rem;
            padding: 1rem;
            background-color: var(--theme-bg-1);
            overflow-y: scroll;

            .options-section {

                .slider-option {
                    width: 16rem;
                    margin-left: 1rem;
                    margin-bottom: 20px;

                    >p {
                        color: var(--theme-background-text-20);
                        font-size: 1rem;
                    }
                }

                >p {
                    color: var( --theme-bg-3 );
                    font-weight: 400;
                    font-size: 1rem;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                >input[type=text] {
                    all: unset;
                    background-color: var(--theme-bg-3);
                    width: 15rem;
                    padding: 8px;
                    margin-bottom: 0.5rem;
                    margin-left: 1rem;
                    border-style: none;
                }
            }
        }
    }
}
</style>
