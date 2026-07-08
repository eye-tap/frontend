<script setup lang="ts">
    import {
        type Ref,
        computed,
        onMounted,
        ref
    } from 'vue';
    import type {
        OverallProgressStatisticsDto
    } from '@/types/dtos/OverallProgressStatisticsDto';
    import type {
        ReadingSessionProgressDto
    } from '@/types/dtos/ReadingSessionProgressDto';
    import {
        addStatsCharts
    } from '@/ts/stats/charts';
    import {
        getStats
    } from '@/ts/stats/loader';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    interface SessionProgress {
        'averageAnnPerFix': number;
        'annotators': number;
        'text': string;
        'sortDescriptor': number;
        'reader': number;
    }

    interface StatsElement {
        'display': string;
        'value': number;
        'prefix'?: string;
    }

    const completion: Ref<HTMLCanvasElement | null> = ref( null );
    const stats: Ref<StatsElement[]> = ref( [] );
    const progress: Ref<SessionProgress[]> = ref( [] );

    const preprocessProgress = ( data: Record<string, ReadingSessionProgressDto> ) => {
        const progressList: SessionProgress[] = [];
        const texts: {
            [key: string]: number
        } = {};

        for ( const key in data ) {
            const el = {
                ...data[key]!
            };
            const textDto = key.substring( key.indexOf( 'ShallowTextDto' ) + 18 );
            const reader = parseInt( key.slice( key.indexOf( 'readerId' ) + 9, key.indexOf( ',' ) ) );
            const text = textDto.slice( textDto.indexOf( 'title' ) + 6, textDto.indexOf( ']' ) );
            const textId = parseInt( textDto.slice( 0, textDto.indexOf( ',' ) ) );

            progressList.push( {
                'averageAnnPerFix': el.averageAnnotationsPerFixation ?? 0,
                'annotators': el.numberOfUniqueAnnotators ?? 0,
                'text': text,
                'sortDescriptor': ( textId * 10000 ) + reader,
                'reader': reader
            } );
            texts[ text ] = textId;
        }

        progress.value = progressList
            .sort( ( a, b ) => a.sortDescriptor - b.sortDescriptor );
        textList.value = Object.keys( texts )
            .map( val => {
                return {
                    'text': val,
                    'sort': texts[ val ]!
                };
            } )
            .sort( ( a, b ) => a.sort - b.sort )
            .map( val => val.text );
        filterQuery.value = textList.value[0]!;
    };

    const preprocessStats = ( data: OverallProgressStatisticsDto ) => {
        const statsList: StatsElement[] = [
            {
                'display': 'Created Annotations',
                'value': data.numberOfAnnotations ?? 0
            },
            {
                'display': 'Users',
                'value': data.numberOfUniqueAnnotators ?? 0
            },
            {
                'display': 'Fixations',
                'value': data.numberOfFixations ?? 0
            },
            {
                'display': 'Available Sets',
                'value': data.numberOfReadingSessions ?? 0
            },
            {
                'display': 'Surveys',
                'value': data.numberOfSurveys ?? 0
            },
            {
                'display': 'Texts',
                'value': data.numberOfTexts ?? 0
            }
        ];

        return statsList.sort( ( a, b ) => a.value - b.value );
    };

    const loadDevModeData = () => {
        textList.value = [
            'text_1_en',
            'text_2_en',
            'text_3_en'
        ];
        filterQuery.value = 'text_1_en';
        stats.value = [
            {
                'display': 'Created Annotations',
                'value': 22
            },
            {
                'display': 'Users',
                'value': 5
            },
            {
                'display': 'Fixations',
                'value': 55555
            },
            {
                'display': 'Available Sets',
                'value': 2222
            },
            {
                'display': 'Surveys',
                'value': 11
            },
            {
                'display': 'Texts',
                'value': 99
            }
        ];

        textList.value.forEach( ( text, idx ) => {
            for ( let i = 0; i < 20; i++ ) {
                progress.value.push( {
                    'annotators': 5,
                    'reader': i,
                    'sortDescriptor': ( idx * 10000 ) + i,
                    'text': text,
                    'averageAnnPerFix': 0.15
                } );
            }
        } );
    };

    const filterQuery = ref( '' );
    const textList: Ref<string[]> = ref( [] );
    const filteredProgress = computed( () => {
        if ( filterQuery.value.length < 2 ) return [];

        return progress.value.filter( val => val.text === filterQuery.value );
    } );

    onMounted( async () => {
        const status = useStatusStore();

        if ( status.devMode ) return loadDevModeData();

        const data = await getStats();

        stats.value = preprocessStats( data.statisticsDto! );

        preprocessProgress( data.progress! as Record<string, ReadingSessionProgressDto> );


        addStatsCharts( data, completion.value! );
    } );
</script>

<template>
    <div class="statistics-wrapper">
        <div class="stats-global-wrapper">
            <h2>Global Statistics</h2>
            <div class="stats-global">
                <p class="subtitle">
                    Chart
                </p>
                <div class="chart-wrapper">
                    <h3>Global Completion</h3>
                    <canvas
                        ref="completion"
                        height="500"
                        width="500"
                    ></canvas>
                    <p>Percentage of sets with at least one annotation for each fixation</p>
                </div>
                <p class="subtitle">
                    Statistics
                </p>
                <div v-if="stats" class="stats">
                    <div v-for="(stat, index) in stats" :key="index">
                        <p class="stat">
                            {{ (stat.prefix ?? '') + stat.value }}
                        </p>
                        <p class="desc">
                            {{ stat.display }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="detailed-stats">
            <div class="details-anchored">
                <h2>Text Statistics</h2>
                <p class="subtitle">
                    Text
                </p>
                <select id="text-select" v-model="filterQuery">
                    <option v-for="(textName, index) in textList" :key="index" :value="textName">
                        {{ textName }}
                    </option>
                </select>
                <p class="subtitle">
                    Readers
                </p>
            </div>
            <div v-if="filteredProgress.length === 0">
                No results to display
            </div>
            <div class="stats-container">
                <div v-for="(session, index) in filteredProgress" :key="index">
                    <p class="stats-text">
                        {{ session.text }}, {{ session.reader }}
                    </p>
                    <div class="stats-element">
                        <p class="stats-num">
                            {{ Math.round( session.averageAnnPerFix * 100 ) / 100 }}
                        </p>
                        <p class="desc">
                            Average annotations/fixation
                        </p>
                    </div>
                    <div class="stats-element">
                        <p class="stats-num">
                            {{ session.annotators }}
                        </p>
                        <p class="desc">
                            Annotators
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .statistics-wrapper {
        margin-top: 1rem;
        max-height: 90vh;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
        position: relative;
        display: flex;
        overflow: hidden;

        >.stats-global-wrapper {
            width: 45%;
            position: relative;
            overflow: hidden;

            border-right: 2px solid var( --theme-bg-3 );
            padding-right: 1rem;

            >h2 {
                padding: 20px;
                padding-bottom: 0;
                margin-top: 0;
                margin-bottom: 0;

                font-size: 2rem;
                font-weight: 500;
            }

            p.small {
                margin: 0;
                font-size: 0.8rem;
                color: var( --theme-bg-3-20 );
                padding-left: 20px;
            }

            >.stats-global {
                display: flex;
                flex-direction: column;
                padding: 2.5%;
                justify-content: center;
                align-items: center;
                background-color: var( --theme-bg-1 );
                margin: 1rem;
                border-radius: 20px;

                >p.subtitle {
                    margin: 0;
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: var( --theme-bg-3 );
                    margin-bottom: 10px;
                }

                >.stats {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    align-items: flex-start;

                    height: 12rem;
                    width: 90%;

                    >div {
                        margin-top: 15px;
                        background-color: var( --theme-bg-2 );
                        width: 8rem;
                        padding: 15px;

                        >p {
                            margin: 0;
                            line-height: 110%;
                            color: var( --theme-bg-4 );
                        }

                        >.desc {
                            color: var( --theme-bg-3-20 );
                            font-size: 0.8rem;
                        }

                        >.stat {
                            font-size: 2rem;
                        }
                    }
                }

                >.chart-wrapper {
                    text-align: center;
                    width: 40%;
                    display: flex;
                    justify-content: flex-end;
                    flex-direction: column;

                    >h3 {
                        margin: 0;
                    }

                    >p {
                        margin: 0;
                        font-size: 0.7rem;
                        color: var( --theme-background-text );
                        margin-bottom: 10px;
                    }
                }
            }
        }

        >.detailed-stats {
            max-height: 80vh;
            width: 49%;
            margin-left: 1rem;
            border-radius: 20px;
            overflow-x: hidden;
            overflow-y: hidden;

            >.details-anchored {
                position: sticky;
                top: 0;
                width: 95%;

                >h2 {
                    padding: 20px;
                    margin-top: 0;
                    margin-bottom: 0;
                    font-size: 2rem;
                    font-weight: 500;
                }

                >p.subtitle {
                    padding-left: 20px;
                    margin: 0;
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: var( --theme-bg-3 );
                    margin-bottom: 10px;
                }

                >select {
                    width: 200px;

                    margin-left: 20px;
                    margin-bottom: 10px;

                    padding: 0.5rem;

                    background-color: var( --theme-bg-2 );
                    color: var( --theme-interactable-text );
                    border: none;

                    >option {
                        background-color: var( --theme-bg-2 );
                        color: var( --theme-interactable-text );
                    }
                }
            }

            >div.stats-container {
                background-color: var( --theme-bg-1 );
                overflow-y: auto;
                max-height: 60vh;

                margin: 1rem;
                padding-right: 1rem;

                >div {
                    width: 95%;
                    margin-bottom: 15px;

                    background-color: var( --theme-bg-2 );
                    padding: 15px;

                    >p.stats-text {
                        font-size: 1.25rem;
                        color: var( --theme-foreground-text );

                        margin: 0;
                        padding-bottom: 1rem;
                    }

                    >.stats-element {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 3rem auto;
                        align-items: center;

                        >p {
                            margin: 0;

                            &.stats-num {
                                font-size: 1rem;
                                color: var( --theme-interactable-text );
                            }

                            &.desc {
                                color: var( --theme-bg-3 );
                                font-size: 0.8rem;
                                font-weight: 800;
                            }
                        }

                    }


                    >.stat {
                        font-size: 2rem;
                    }
                }
            }
        }
    }
</style>
