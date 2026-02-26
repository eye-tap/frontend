import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    algorithmsList,
    annotations,
    boundingBoxes,
    canvasSize,
    fixations,
    selectedAlgorithm,
    selectedFixation
} from '../data';
import {
    assignedLineColor,
    lineWidth,
    linesDisplay,
    numberOfLinesToRenderInSurroundingMode
} from '../config';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorAnnotation
} from '../types/annotation';

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

        // Render
        if ( linesDisplay.value === 'all' ) {
            annotations.value.forEach( l => {
                filterAlgorithms( l, drawLine );
            } );
        } else if ( linesDisplay.value === 'previous' ) {
            if ( selectedFixation.value >= 0 )
                annotations.value.forEach( l => {
                    filterAlgorithms( l, previousDrawer );
                } );
        } else if ( linesDisplay.value === 'surrounding' ) {
            if ( selectedFixation.value >= 0 )
                annotations.value.forEach( l => {
                    filterAlgorithms( l, surroundingDrawer );
                } );
        } else if ( linesDisplay.value === 'allalgos' ) {
            // TODO: Do we want more settings here? (like )
            if ( selectedFixation.value >= 0 )
                annotations.value.forEach( l => {
                    if ( l.fixationId === selectedFixation.value )
                        drawLine( l );
                } );
        }
    };

    const filterAlgorithms = ( l: EditorAnnotation, drawFunc: ( l: EditorAnnotation ) => void ) => {
        const assignType = fixations.value[ l.fixationId ]!.assigned;

        if ( assignType === 'invalid' ) return;

        if ( assignType === 'assigned' ) drawFunc( l ); // TODO: This is not good yet (will render all assignments)


        if ( !l.algorithm ) {
            if ( selectedAlgorithm.value > -1 ) return;
            else drawFunc( l );
        } else {
            if ( l.algorithm === algorithmsList.value[ selectedAlgorithm.value ]! )
                drawFunc( l );
        }
    };

    const previousDrawer = ( l: EditorAnnotation ) => {
        if ( l.fixationId === selectedFixation.value )
            drawLine( l );
        else if ( l.fixationId === selectedFixation.value - 1 )
            drawLine( l );
    };

    const surroundingDrawer = ( l: EditorAnnotation ) => {
        if ( l.fixationId > selectedFixation.value - numberOfLinesToRenderInSurroundingMode.value
            || l.fixationId < selectedFixation.value + numberOfLinesToRenderInSurroundingMode.value )
            drawLine( l );
    };

    const drawLine = ( line: EditorAnnotation ) => {
        const fix = fixations.value[ line.fixationId ]!;
        const box = boundingBoxes.value[ line.boxId ]!;

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
        selectedFixation
    ], render );

    return {
        render
    };
};
