import {
    ArcElement,
    Chart,
    Legend,
    PieController,
    Tooltip
} from 'chart.js';

Chart.register( PieController, ArcElement, Legend, Tooltip );

export const addStatsCharts = ( progress: number, completion: HTMLCanvasElement ) => {
    const style = window.getComputedStyle( document.documentElement );
    const color1 = style.getPropertyValue( '--theme-bg-4' );
    const color2 = style.getPropertyValue( '--theme-bg-2' );
    const color3 = style.getPropertyValue( '--theme-bg-3' );

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
                    color1,
                    color2
                ],
                'borderColor': [ color3 ],
                'indexAxis': 'y'
            } ]
        }
    } );
};
