import {
    fixations,
    selectedFixation
} from '../data';
import {
    numberOfFixationsToConnectInScanPathRendering,
    renderScanPath,
    scanPathLineColor,
    scanPathLineWidth
} from '../config';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorFixation
} from '../types/fixations';

export const scanPathRenderer = ( ctx: CanvasRenderingContext2D ) => {
    if ( !renderScanPath.value ) return;

    const draw = drawScanPathLine( ctx );
    const min = selectedFixation.value - numberOfFixationsToConnectInScanPathRendering.value >= 0
        ? -numberOfFixationsToConnectInScanPathRendering.value
        : -selectedFixation.value;
    const max = selectedFixation.value + numberOfFixationsToConnectInScanPathRendering.value + 1 < fixations.value.length
        ? numberOfFixationsToConnectInScanPathRendering.value
        : fixations.value.length - 1 - selectedFixation.value;

    for ( let i = min; i < max; i++ ) {
        if ( selectedFixation.value + i >= 0 && selectedFixation.value + i + 1 < fixations.value.length ) {
            draw( fixations.value[ selectedFixation.value + i ]!, fixations.value[ selectedFixation.value + i + 1 ]! );
        }
    }
};

const drawScanPathLine = ( ctx: CanvasRenderingContext2D ) => {
    return ( p1: EditorFixation, p2: EditorFixation ) => {
        ctx.lineWidth = scale( scanPathLineWidth.value );
        ctx.strokeStyle = scanPathLineColor.value;
        ctx!.beginPath();
        ctx!.moveTo(
            scale( originalToCanvasCoordinates( p1.x!, 'x' ) ),
            scale( originalToCanvasCoordinates( p1.y!, 'y' ) )
        );
        ctx!.lineTo(
            scale( originalToCanvasCoordinates( p2.x!, 'x' ) ),
            scale( originalToCanvasCoordinates( p2.y!, 'y' ) )
        );
        ctx!.stroke();
    };
};
