import {
    ArcElement,
    Chart,
    PieController
} from 'chart.js';
import type {
    ProgressDto
} from '@/types/dtos/ProgressDto';

Chart.register( PieController, ArcElement );

export const addStatsCharts = ( data: ProgressDto, completion: HTMLCanvasElement ) => {
    new Chart( completion, {
        'type': 'pie',
        'options': {
            'aspectRatio': 1
        },
        'data': {
            'labels': [
                'Assigned',
                'Unassigned'
            ],
            'datasets': [ {
                'label': 'Percentage of fixations with at least one assignment',
                'data': [
                    data.statisticsDto!.progressUntilEverythingIsAnnotatedOnce!,
                    1 - data.statisticsDto!.progressUntilEverythingIsAnnotatedOnce!
                ],
                'backgroundColor': [
                    'rgb(50, 210, 40)',
                    'rgb(255, 20, 30)'
                ],
                'indexAxis': 'y'
            } ]
        }
    } );
};
