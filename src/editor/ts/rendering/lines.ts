import {
    annotationLineColor,
    cursorLineColor,
    lineWidth
} from '../data/config';
import {
    boxes,
    cursorLine,
    filteredPoints,
    renderData as rd
} from '../data/internal-data';
import {
    scale
} from './scaling';

const drawLines = () => {
    if ( cursorLine.value ) {
        rd.ctx!.strokeStyle = cursorLineColor.value;
        rd.ctx!.lineWidth = scale( lineWidth.value );
        rd.ctx!.beginPath();
        rd.ctx!.moveTo( scale( cursorLine.value.x1 ), scale( cursorLine.value.y1 ) );
        rd.ctx!.lineTo( scale( cursorLine.value.x2 ), scale( cursorLine.value.y2 ) );
        rd.ctx!.stroke();
    }

    rd.ctx!.lineWidth = lineWidth.value;
    rd.ctx!.strokeStyle = annotationLineColor.value;

    for ( const p of filteredPoints.value ) {
        const idx = parseInt( String( p.annotedbox ) );

        if ( boxes.boxes[idx] ) {
            rd.ctx!.beginPath();
            rd.ctx!.moveTo( scale( p.x ), scale( p.y ) );
            /*   console.log('Drawing line to:', boxes[p.annotedbox].centerX, boxes[p.annotedbox].centerY); */
            rd.ctx!.lineTo( scale( boxes.boxes[idx]!.centerX ), scale( boxes.boxes[idx].centerY ) );
            rd.ctx!.stroke();
        }
    }
};

export {
    drawLines
};
