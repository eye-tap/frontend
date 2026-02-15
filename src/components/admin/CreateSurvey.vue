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
    import SwitchOption from '../settings/SwitchOption.vue';
    import testData from '@/ts/dev/TextTestData.json';

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
    const selectedTextIndex = ref( -1 );
    const devMode = import.meta.env.VITE_DISABLE_LOGIN_CHECK;

    const selectText = ( index: number ) => {
        selectedTextIndex.value = index;
    };

    const isSelectOrUnselectAll = ( textIdx: number ) => {
        return computed( () => {
            return texts.value[ textIdx ]!.selected.reduce( ( res, val ) => res && val ) ? 'Deselect all' : 'Select all';
        } );
    };

    const loadTexts = async () => {
        if ( devMode ) return useTestData();

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

    const useTestData = () => {
        const list: Text[] = testData.list;

        texts.value = list!;
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
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
                    <span>
                        <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="loadTexts()"></i>
                    </span>
                    <span>
                        <i class="fa-lg fa-solid fa-close close-icon" @click="dismiss"></i>
                    </span>
                </div>
            </div>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p>General</p>
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
                    </div>

                    <div class="options-section">
                        <p>Texts to include</p>

                        <div class="multi-table-wrapper">
                            <div class="left-table-wrapper">
                                <table v-if="texts.length > 0">
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
                                            v-for="text, index in texts"
                                            :key="index"
                                            :class="index === selectedTextIndex ? 'selected' : ''"
                                            @click="selectText( index )"
                                        >
                                            <td class="text-name">
                                                {{ text.title }}
                                            </td>
                                            <td class="select-all">
                                                <div @Click="toggleSelectAllForText(index)">
                                                    <SwitchOption text="" />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="selectedTextIndex !== -1" class="right-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Reader</th>
                                            <th>Selected</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="session, index in texts[selectedTextIndex]?.sessions"
                                            :key="index"
                                        >
                                            <td>
                                                {{ session.reader }}
                                            </td>
                                            <td class="select-all">
                                                <div>
                                                    <SwitchOption v-model="texts[selectedTextIndex]!.selected[index]" text="" />
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

    textarea {
        resize: none;
        display: block;

        all: unset;
        background-color: var(--theme-bg-3);
        width: 30rem;
        padding: 8px;
        margin-bottom: 0.5rem;
        margin-left: 1rem;
        border-style: none;
        overflow: hidden;
    }
    textarea:hover {
        background-color: var(--theme-bg-3-20);
    }

    textarea:focus {
        background-color: var(--theme-bg-3-20);
    }

    input[type=text] {
        all: unset;
        background-color: var(--theme-bg-3);
        width: 14rem;
        padding: 8px;
        margin-bottom: 0.5rem;
        margin-left: 1rem;
        border-style: none;
    }

    input[type=text]:hover {
        background-color: var(--theme-bg-3-20);
    }

    input[type=text]:focus {
        background-color: var(--theme-bg-3-20);
    }

    .multi-table-wrapper {
        display: grid;
        grid-template-columns: 50% 50%;

        .left-table-wrapper {
            overflow-y: scroll;
            max-height: 50vh;
            margin-right: 1rem;
            padding: 0px 1rem;
        }

        .right-table-wrapper {
            overflow-y: scroll;
            max-height: 50vh;
            padding: 0px 1rem;
        }

        .placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--theme-background-text-20);
        }
    }

    table {
        width: 100%;
        table-layout: auto;
        border-spacing: 0 15px;

        >thead {
            border-spacing: 0;

            >tr {
                >th {
                    color: var(--theme-bg-3);

                    >div {
                        display: flex;
                        justify-content: start;
                        align-items: center;

                        .sort {
                            rotate: 0deg;
                            transition: rotate 0.25s linear;
                            height: 1.25rem;
                            width: 1.25rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &.ascending {
                                rotate: 180deg;
                            }
                        }
                    }
                }
            }
        }

        >tbody {
            >tr {
                &:hover {
                    >td {
                        background-color: var( --theme-bg-3-shade );
                        color: var(--theme-interactable-text);
                    }
                    >.select-all>div {
                        background-color: var(--theme-bg-2-shade);
                    }
                }

                &.selected {
                    >td {
                        background-color: var( --theme-bg-3);
                        color: var(--theme-foreground-text);
                    }

                    >.select-all>div {
                        background-color: var(--theme-bg-2-shade);
                    }
                }

                >td {
                    padding: 15px 0;
                    padding-left: 10px;
                    width: max-content;
                    background-color: var( --theme-bg-2 );
                    color: var(--theme-background-text-20);
                    margin-top: 5px;
                    cursor: pointer;

                    >p {
                        font-size: 0.85rem;
                        color: var(--theme-bg-4-20);
                        padding-right: 2rem;
                    }
                }

                >.text-name {
                    width: 70%;
                    padding-left: 15px;
                    color: var(--theme-interactable-text);
                }

                >.select-all {
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


    >.create-survey-box {
        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >div {
                display: flex;
                align-items: center;
                justify-content: center;

                >span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 10px;
                    width: 30px;
                    height: 30px;

                    >i {
                        cursor: pointer;
                    }
                    >i:hover {
                        color: var(--theme-bg-4-20);
                    }
                    .refresh-icon {
                        transition: rotate 0.2s;
                    }
                    .refresh-icon:hover {
                        rotate: 135deg;
                    }
                }

            }

            >h1 {
                font-size: 2rem;
            }

        }

        width: 50vw;
        height: 75vh;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;

        .options-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 62vh;
            padding: 1rem;
            background-color: var(--theme-bg-1);
            overflow-y: scroll;
            scrollbar-color: var( --theme-bg-4 ) var( --theme-bg-3 );

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
            }
        }
    }
}
</style>
