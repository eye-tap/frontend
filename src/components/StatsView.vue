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

    const filterQuery = ref( '' );
    const textList: Ref<string[]> = ref( [] );
    const filteredProgress = computed( () => {
        if ( filterQuery.value.length < 2 ) return [];

        return progress.value.filter( val => val.text === filterQuery.value );
    } );

    onMounted( async () => {
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
                <div class="chart-wrapper">
                    <h3>Global Completion</h3>
                    <p>This chart shows the percentage of sets with at least one annotation per fixation</p>
                    <canvas
                        ref="completion"
                        height="500"
                        width="500"
                    ></canvas>
                </div>
            </div>
        </div>
        <div class="detailed-stats">
            <div class="details-anchored">
                <h2>Statistics for each text</h2>
                <select id="text-select" v-model="filterQuery">
                    <option v-for="(textName, index) in textList" :key="index" :value="textName">
                        {{ textName }}
                    </option>
                </select>
            </div>
            <div v-if="filteredProgress.length === 0">
                No results to display
            </div>
            <div v-for="(session, index) in filteredProgress" :key="index">
                <p class="stats-text">
                    {{ session.text }}, {{ session.reader }}
                </p>
                <p class="stats-avg-fix">
                    {{ Math.round( session.averageAnnPerFix * 100 ) / 100 }}
                </p>
                <p class="desc">
                    Average number of annotations per fixation
                </p>
                <p class="stats-avg-fix">
                    {{ session.annotators }}
                </p>
                <p class="desc">
                    Annotators have access to set
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .statistics-wrapper {
        height: 100%;
        position: relative;
        display: flex;

        >.stats-global-wrapper {
            width: 45%;
            background-color: var( --theme-bg-2 );
            border-radius: 20px;
            position: relative;
            overflow: hidden;

            >h2 {
                padding: 20px 2.5%;
                background-color: var( --theme-bg-3 );
                margin-top: 0;
            }

            >.stats-global {
                display: flex;
                padding: 2.5%;
                justify-content: center;
                align-items: center;

                >.stats {
                    display: flex;
                    align-items: flex-start;
                    height: 100%;
                    width: 60%;
                    justify-content: center;
                    flex-direction: column;
                    margin-right: auto;

                    >div {
                        margin-top: 15px;

                        >p {
                            margin: 0;
                            line-height: 110%;
                        }

                        >.desc {
                            color: var( --theme-background-text );
                            font-size: 0.7rem;
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
            height: 100%;
            width: 49%;
            margin-left: 2%;
            overflow: scroll;
            position: relative;
            background-color: var(--theme-bg-2);
            border-radius: 20px;
            overflow-x: hidden;
            overflow-y: scroll;

            >.details-anchored {
                >h2 {
                    margin: 0;
                }
                position: sticky;
                top: 0;
                width: 95%;
                margin: 0 0 10px 0;
                background-color: var( --theme-bg-3 );
                padding: 20px 2.5%;
            }

            >div {
                width: 95%;
                margin-left: auto;
                margin-right: auto;
                margin-top: 15px;

                >p {
                    margin: 0;
                    line-height: 110%;
                }

                >.desc {
                    color: var( --theme-background-text );
                    font-size: 0.7rem;
                }

                >.stat {
                    font-size: 2rem;
                }
            }
        }
    }
</style>
