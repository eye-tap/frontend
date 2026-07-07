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
        'text': string;
        'annotators': number;
    }

    const completion: Ref<HTMLCanvasElement | null> = ref( null );
    const stats: Ref<OverallProgressStatisticsDto> = ref( {} );
    const progress: Ref<SessionProgress[]> = ref( [] );

    const preprocessProgress = ( data: Record<string, ReadingSessionProgressDto> ) => {
        const progressList: SessionProgress[] = [];

        for ( const key in data ) {
            const el = {
                ...data[key]!
            };

            progressList.push( {
                'averageAnnPerFix': el.averageAnnotationsPerFixation ?? 0,
                'annotators': el.numberOfUniqueAnnotators ?? 0,
                'text': key.slice( key.indexOf( 'title' ) + 6, key.indexOf( ']' ) )
            } );
        }

        return progressList;
    };

    onMounted( async () => {
        const data = await getStats();

        stats.value = data.statisticsDto!;

        progress.value = preprocessProgress( data.progress! as Record<string, ReadingSessionProgressDto> )
            .sort( ( a, b ) => {
                return a.text.localeCompare( b.text );
            } );


        addStatsCharts( data, completion.value! );
    } );
</script>

<template>
    <div class="statistics-wrapper">
        <h1>Statistics</h1>
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
                {{ session.text }}: {{ session.averageAnnPerFix }}
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
