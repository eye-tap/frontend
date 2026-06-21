import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    annotations,
    annotationsForCurrentFixation,
    boundingBoxes,
    canvasSize,
    fixations,
    machineAnnotations,
    selectedFixation
} from '../data';
import {
    assignedLineColor,
    highlightAllAlgosAssignedBoxes,
    lineWidth,
    linesDisplay,
    machineAssignedLineColor,
    machineAssignedLineWidth
} from '../config';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorAnnotation
} from '../types/annotation';

/**
 * Render the annotation lines
 * @param linesCanvas - The canvas to render into
 * @returns Render trigger function
 */
export const linesRenderer = ( linesCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
        ctx.lineWidth = scale( lineWidth.value );
        ctx.strokeStyle = assignedLineColor.value;

        if ( linesDisplay.value === 'allalgos' && highlightAllAlgosAssignedBoxes.value )
            annotationsForCurrentFixation.value = machineAnnotations.value.filter( l => {
                return l.fixationIdx === selectedFixation.value;
            } );

        // Render
        if ( linesDisplay.value === 'all' ) {
            annotations.value.forEach( drawLine );
        } else if ( linesDisplay.value === 'previous' ) {
            if ( selectedFixation.value >= 0 )
                annotations.value.forEach( previousDrawer );
        } else if ( linesDisplay.value === 'allalgos' ) {
            ctx.lineWidth = scale( machineAssignedLineWidth.value );
            ctx.strokeStyle = machineAssignedLineColor.value;

            if ( selectedFixation.value >= 0 )
                annotationsForCurrentFixation.value.forEach( l => {
                    drawLine( l );
                } );
        }
    };

    /**
     * Draw the current or previous line
     * @param l - The Annotation that is to be checked against the drawer
     */
    const previousDrawer = ( l: EditorAnnotation ) => {
        if ( l.fixationIdx === selectedFixation.value )
            drawLine( l );
        else if ( l.fixationIdx === selectedFixation.value - 1 )
            drawLine( l );
    };

    const drawLine = ( line: EditorAnnotation ) => {
        const fix = fixations.value[ line.fixationIdx ]!;
        const box = boundingBoxes.value[ line.boxIdx ]!;

        ctx!.beginPath();
        ctx!.moveTo(
            scale( originalToCanvasCoordinates( fix.x!, 'x' ) ),
            scale( originalToCanvasCoordinates( fix.y!, 'y' ) )
        );
        ctx!.lineTo(
            scale( originalToCanvasCoordinates( box.centerX!, 'x' ) ),
            scale( originalToCanvasCoordinates( box.centerY!, 'y' ) )
        );
        ctx!.stroke();
    };

    onMounted( () => {
        ctx = linesCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( [
        lineWidth,
        assignedLineColor,
        selectedFixation,
        linesDisplay
    ], render );

    return {
        render
    };
};
