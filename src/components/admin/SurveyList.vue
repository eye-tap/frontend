<script setup lang="ts">
    import {
        type Ref,
        ref
    } from 'vue';
    import CreateSurvey from './CreateSurvey.vue';
    import type {
        SurveyDto
    } from '@/types/dtos/SurveyDto';
    import {
        listSurveys
    } from '@/ts/surveys';
    import {
        useNotification
    } from '@kyvg/vue3-notification';

    const loading = ref( false );
    const surveys: Ref<SurveyDto[]> = ref( [] );
    const selectedSurveyIndex = ref( -1 );
    const isShowingAddSurvey = ref( false );
    const notifications = useNotification();

    const reloadFromServer = async () => {
        loading.value = true;

        try {
            surveys.value = await listSurveys();
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

    const selectSurvey = ( surveyId: number ) => {
        selectedSurveyIndex.value = surveyId;
    };

    const addSurvey = () => {
        isShowingAddSurvey.value = true;
    };

    reloadFromServer();
</script>

<template>
    <div class="survey-picker">
        <div class="survey-picker-title">
            <span>
                <i class="fa-xl fa-solid fa-file"></i>
                <p>Select survey</p>
                <i v-if="loading" class="fa-xl fa-solid fa-circle-notch loading-spinner"></i>
            </span>
            <div>
                <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="reloadFromServer"></i>
                <i class="fa-lg fa-solid fa-plus refresh-icon" @click="addSurvey"></i>
            </div>
        </div>
        <div class="table-wrapper">
            <table v-if="surveys.length > 0">
                <thead>
                    <tr>
                        <th class="survey-name">
                            Name
                        </th>
                        <th class="survey-user-count">
                            User count
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="survey, index in surveys"
                        :key="survey.id"
                        :class="index === selectedSurveyIndex ? 'selected' : ''"
                        @click="selectSurvey( index )"
                    >
                        <td class="survey-name">
                            {{ survey.title }}
                        </td>
                        <td class="survey-user-count">
                            {{ survey.userIds?.length }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else style="flex-direction: column;">
                <p>No surveys available yet</p>
                <button @click="addSurvey">
                    Add survey
                </button>
            </div>
        </div>
        <CreateSurvey v-model="isShowingAddSurvey" />
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.survey-picker {
    @include home-boxes();
    user-select: none;
    background-color: var(--theme-bg-2);
    padding-top: 0.5rem;
    border-radius: 20px;
    margin: 0px;

    .survey-picker-title {
        background-color: var(--theme-bg-2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0px;

        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .loading-spinner {
            color: var(--theme-bg-4);
            margin-left: 1rem;
            animation: rotating 2s linear infinite;
        }

        .left {
            border-radius: 15px 0px 0px 15px;
        }

        .right {
            border-radius: 0px 15px 15px 0px;
        }

        >div {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .refresh-icon {
                margin-right: 10px;
                cursor: pointer;
                color: var(--theme-bg-4);

                &:hover {
                    color: var(--theme-bg-4-20);
                }

                &:focus {
                    animation: rotating 1s linear 1;
                }
            }
        }

        >span {
            display: flex;
            align-items: center;
            justify-content: space-between;

            color: var(--theme-bg-5);
            padding-left: 0px;
            margin-left: 0px;

            >p {
                padding-left: 0.75rem;
                font-size: 1.25rem;
                color: var(--theme-foreground-text);
            }
        }
    }

    .file-picker-mode {
        display: flex;
        >label {

            padding: 10px;
            background-color: var( --theme-bg-3 );
            transition: background-color 0.25s;
            cursor: pointer;

            &.selected {
                background-color: var( --theme-bg-4 );
                cursor: unset;
            }

            >p {
                margin: 0;
            }
            >input {
                display: none;
            }
        }
    }

    .table-wrapper {
        background-color: var(--theme-bg-1);
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        width: 95%;

        >div {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 5rem;
            padding-bottom: 5rem;

            >p {
                color: var(--theme-background-text-20);
            }
        }

        >table {
            width: 100%;
            table-layout: auto;
            border-spacing: 0 15px;

            >thead {
                border-spacing: 0;

                >tr {
                    >th {
                        cursor: pointer;
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
                overflow: scroll;
                scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
                >tr {
                    &:hover {
                        >td {
                            background-color: var( --theme-bg-3-shade );
                            color: var(--theme-interactable-text);
                        }
                    }

                    &.selected {
                        >td {
                            background-color: var( --theme-bg-3 );
                            color: var(--theme-foreground-text);
                        }
                    }

                    >td {
                        padding: 15px 0;
                        width: max-content;
                        background-color: var( --theme-bg-2 );
                        color: var(--theme-background-text-20);
                        margin-top: 5px;
                        cursor: pointer;
                    }

                    >.survey-name {
                        width: 70%;
                        padding-left: 15px;
                        color: var(--theme-interactable-text);
                    }

                    >.file-size {
                        padding-right: 15px;
                    }
                }
            }
        }
    }
}
</style>
