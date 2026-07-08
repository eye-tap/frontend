import {
    ArcElement,
    Chart,
    Legend,
    PieController,
    Tooltip
} from 'chart.js';

Chart.register( PieController, ArcElement, Legend, Tooltip );

export const addStatsCharts = ( progress: number, completion: HTMLCanvasElement ) => {
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
                    progress * 100,
                    ( 1 - progress ) * 100
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
