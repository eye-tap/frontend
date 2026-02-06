import {
    annotationPointColor,
    assignedPointColor,
    pointRadius,
    selectedPointColor,
    showOnlyPreviousPoints,
    showPointIndex
} from '../data/config';
import {
    filteredPoints,
    renderData as rd,
    selectedPoint
} from '../data/internal-data';
import {
    scale
} from './scaling';

const drawPoints = () => {
    let index = 0;

    for ( const p of filteredPoints.value ) {
        if ( p.annotedbox != null ) {
            rd.ctx!.fillStyle = assignedPointColor.value;
        } else {
            rd.ctx!.fillStyle = annotationPointColor.value;
        }

        if ( showPointIndex.value ) {
            rd.ctx!.fillText( index.toString(), scale( p.x ) + scale( pointRadius.value ), scale( p.y ) - scale( pointRadius.value ) );
        }

        index++;

        if ( showOnlyPreviousPoints.value && p === selectedPoint.value ) {
            break;
        }

        rd.ctx!.beginPath();
        rd.ctx!.arc( scale( p.x ), scale( p.y ), scale( pointRadius.value ), 0, Math.PI * 2 );
        rd.ctx!.fill();
    }

    rd.ctx!.fillStyle = selectedPointColor.value;

    if ( selectedPoint.value ) {
        rd.ctx!.beginPath();
        rd.ctx!.arc( scale( selectedPoint.value.x ), scale( selectedPoint.value.y ), scale( pointRadius.value * 1.75 ), 0, Math.PI * 2 );
        rd.ctx!.fill();
    }
};


export {
    drawPoints
};
