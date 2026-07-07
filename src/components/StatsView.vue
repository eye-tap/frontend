<script setup lang="ts">
    import {
        type Ref,
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
        'name': string;
        'annotators': number;
    }

    const completion: Ref<HTMLCanvasElement | null> = ref( null );
    const stats: Ref<OverallProgressStatisticsDto> = ref( {} );
    const progress: Ref<SessionProgress[]> = ref( [] );

    const getTextName = ( key: string ) => {
        const readerSubstring = key.substring( key.indexOf( 'ShallowTextDto' ) + 18 );
        const readerEndIdx = readerSubstring.indexOf( ',' );

        return readerSubstring.slice( readerEndIdx + 8, readerSubstring.indexOf( ']' ) ) + ', ' + readerSubstring.slice( 0, readerEndIdx );
    };

    const preprocessProgress = ( data: Record<string, ReadingSessionProgressDto> ) => {
        const progressList: SessionProgress[] = [];

        for ( const key in data ) {
            const el = data[key]!;

            progressList.push( {
                'averageAnnPerFix': el.averageAnnotationsPerFixation ?? 0,
                'annotators': el.numberOfUniqueAnnotators ?? 0,
                'name': getTextName( key )
            } );
        }

        progress.value = progressList;
    };

    onMounted( async () => {
        const data = await getStats();

        stats.value = data.statisticsDto!;

        preprocessProgress( data.progress! as Record<string, ReadingSessionProgressDto> );

        addStatsCharts( data, completion.value! );
    } );
</script>

<template>
    <div class="statistics-wrapper">
        <div class="stats-top-wrapper">
            <div v-if="stats" class="stats">
                <div>
                    <p>Users</p>
                    <p>{{ stats.numberOfUniqueAnnotators }}</p>
                </div>
                <div>
                    <p>Created Annotations</p>
                    <p>{{ stats.numberOfAnnotations }}</p>
                </div>
                <div>
                    <!-- TODO: Name this better -->
                    <p>Total number of annoation sessions</p>
                    <p>{{ stats.numberOfReadingSessions }}</p>
                </div>
                <div>
                    <p>Available Texts</p>
                    <p>{{ stats.numberOfTexts }}</p>
                </div>
                <div>
                    <p>Surveys</p>
                    <p>{{ stats.numberOfSurveys }}</p>
                </div>
            </div>
            <div class="chart-wrapper">
                <canvas
                    ref="completion"
                    height="500"
                    width="500"
                ></canvas>
            </div>
        </div>
        <div v-if="stats" class="detailed-stats">
            <div v-for="(session, index) in progress" :key="index">
                {{ session.name }}: {{ session.averageAnnPerFix }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .stats-top-wrapper {
        width: 95%;
        background-color: var( --theme-bg-2 );
        padding: 2%;
        border-radius: 20px;
        display: flex;

        >.stats {
            display: flex;
            align-items: flex-start;
            height: 100%;
            justify-content: center;
            flex-direction: column;
            margin-right: auto;

            p {
                margin: 0;
            }
        }
    }
</style>
