import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    canvasSize,
    fixations,
    selectedFixation
} from '../data';
import {
    fixationDisplay,
    numberOfFixationsToConnectInScanPathRendering,
    renderScanPath,
    scanPathLineColor,
    scanPathLineWidth,
    scanpathOpacity
} from '../config';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorFixation
} from '../types/fixations';

/**
 * Render the scan path
 * @param scanpathCanvas - The canvas to render into
 * @returns [TODO:return]
 */
export const scanPathRenderer = ( scanpathCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
        ctx.globalAlpha = scanpathOpacity.value;

        // Only draw the scan path if enabled and all fixations are displayed
        if ( fixationDisplay.value !== 'all' || !renderScanPath.value ) return;

        const draw = drawScanPathLine( ctx );
        // Compute the minimum fixation index to display
        const min = selectedFixation.value - numberOfFixationsToConnectInScanPathRendering.value >= 0
            ? -numberOfFixationsToConnectInScanPathRendering.value
            : -selectedFixation.value;
        // Compute the maximum fixation index to display
        const max = selectedFixation.value + numberOfFixationsToConnectInScanPathRendering.value + 1 < fixations.value.length
            ? numberOfFixationsToConnectInScanPathRendering.value
            : fixations.value.length - 1 - selectedFixation.value;

        for ( let i = min; i < max; i++ ) {
            if ( selectedFixation.value + i >= 0 && selectedFixation.value + i + 1 < fixations.value.length ) {
                draw( fixations.value[ selectedFixation.value + i ]!, fixations.value[ selectedFixation.value + i + 1 ]! );
            }
        }
    };

    watch( [
        numberOfFixationsToConnectInScanPathRendering,
        selectedFixation,
        renderScanPath,
        fixationDisplay
    ], render );

    onMounted( () => {
        ctx = scanpathCanvas.value!.getContext( '2d' );
        render();
    } );

    return {
        render
    };
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
