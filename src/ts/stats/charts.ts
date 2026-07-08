import {
    ArcElement,
    Chart,
    Legend,
    PieController,
    Tooltip
} from 'chart.js';
import type {
    ProgressDto
} from '@/types/dtos/ProgressDto';

Chart.register( PieController, ArcElement, Legend, Tooltip );

export const addStatsCharts = ( data: ProgressDto, completion: HTMLCanvasElement ) => {
    Chart.overrides.pie.plugins.legend.display = true;
    new Chart( completion, {
        'type': 'pie',
        'options': {
            'plugins': {
                'legend': {
                    'position': 'bottom'
                }
            },
            'interaction': {
                'mode': 'nearest'
            }
        },
        'data': {
            'labels': [
                'Assigned',
                'Unassigned'
            ],
            'datasets': [ {
                'label': 'Annotation Completion',
                'data': [
                    data.statisticsDto!.progressUntilEverythingIsAnnotatedOnce! * 100,
                    ( 1 - data.statisticsDto!.progressUntilEverythingIsAnnotatedOnce! ) * 100
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
