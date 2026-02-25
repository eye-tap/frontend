import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    assignedFixationColor,
    dropShadowInnerSize,
    dropShadowOpacityEnd,
    dropShadowOpacityStart,
    dropShadowPasses,
    dropShadowSize,
    fixationDisplay,
    fixationIndexDisplay,
    fixationRadius,
    indicesFontFamily,
    indicesFontSize,
    machineAssignedFixationColor,
    selectedFixationColor,
    unassignedFixationColor
} from '../config';
import {
    canvasSize,
    fixations,
    selectedFixation
} from '../data';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorFixation
} from '../types/fixations';

export const indicesRenderer = ( indicesCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;

        // Render points
        if ( fixationIndexDisplay.value === 'always' ) {
            fixations.value.filter( getCorrectFilterFunction() ).forEach( ( fix, idx ) => {
                if ( idx === selectedFixation.value ) {
                    draw( fix, idx, selectedFixationColor.value );
                } else {
                    if ( fix.assigned === 'assigned' ) {
                        draw( fix, idx, assignedFixationColor.value );
                    } else if ( fix.assigned === 'unassigned' ) {
                        draw( fix, idx, unassignedFixationColor.value );
                    } else if ( fix.assigned === 'machine' ) {
                        draw( fix, idx, machineAssignedFixationColor.value );
                    }
                }
            } );
        } else if ( fixationIndexDisplay.value === 'surrounding' ) {
            fixations.value.filter( getCorrectFilterFunction() ).forEach( ( fix, idx ) => {
                if ( idx === selectedFixation.value ) {
                    draw( fix, idx, selectedFixationColor.value );
                } else if ( idx === selectedFixation.value - 1 || idx === selectedFixation.value + 1 ) {
                    if ( fix.assigned === 'assigned' ) {
                        draw( fix, idx, assignedFixationColor.value );
                    } else if ( fix.assigned === 'unassigned' ) {
                        draw( fix, idx, unassignedFixationColor.value );
                    } else if ( fix.assigned === 'machine' ) {
                        draw( fix, idx, machineAssignedFixationColor.value );
                    }
                }
            } );
        }
    };

    const draw = ( fixation: EditorFixation, idx: number, col: string ) => {
        // Drop shadow
        const movePerIterOutside = dropShadowSize.value / dropShadowPasses.value;
        const movePerIterInside = dropShadowInnerSize.value / dropShadowPasses.value;
        const opacityPerStep = ( dropShadowOpacityStart.value - dropShadowOpacityEnd.value ) / dropShadowPasses.value;
        const fontScaleUpPerIterOutside = 2 * movePerIterOutside;
        const fontScaleUpPerIterInside = 2 * movePerIterInside;
        const numberToShow = ( idx + 1 ).toString();

        let totalOffset = 0;

        for ( let j = 0; j < numberToShow.length; j++ ) {
            const toDisplay = numberToShow[ j ]!;
            const width = ctx!.measureText( toDisplay ).width;

            // Outer shadow
            if ( dropShadowSize.value > 0 && dropShadowPasses.value > 0 )
                for ( let i = 0; i < dropShadowPasses.value; i++ ) {
                    const fontSize = scale( indicesFontSize.value + ( fontScaleUpPerIterOutside * i ) );

                    ctx!.font = fontSize + 'px ' + indicesFontFamily.value;
                    ctx!.fillStyle = `rgba( 0, 0, 0, ${ dropShadowOpacityStart.value + ( opacityPerStep * i ) } )`;
                    const aspect = ctx!.measureText( toDisplay ).width / fontSize;

                    ctx!.fillText(
                        toDisplay,
                        scale( originalToCanvasCoordinates( ( fixation.x! + fixationRadius.value ) - ( movePerIterOutside * i * aspect ), 'x' ) ) + totalOffset,
                        scale( originalToCanvasCoordinates( ( fixation.y! - fixationRadius.value ) + ( movePerIterOutside * i ), 'y' ) )
                    );
                }

            // Inner shadow
            if ( dropShadowInnerSize.value !== 0 )
                for ( let i = 0; i < dropShadowPasses.value; i++ ) {
                    const fontSize = scale( indicesFontSize.value
                        - ( 2 * dropShadowInnerSize.value ) + ( fontScaleUpPerIterInside * i ) );

                    ctx!.font = fontSize + 'px ' + indicesFontFamily.value;
                    ctx!.fillStyle = `rgba( 0, 0, 0, ${ dropShadowOpacityEnd.value - ( opacityPerStep * i ) } )`;
                    const aspect = ctx!.measureText( toDisplay ).width / fontSize;

                    ctx!.fillText(
                        toDisplay,
                        scale( originalToCanvasCoordinates( ( fixation.x! + fixationRadius.value ) - ( movePerIterInside * i * aspect ), 'x' ) ) + totalOffset,
                        scale( originalToCanvasCoordinates( ( fixation.y! - fixationRadius.value ) + ( movePerIterInside * i ), 'y' ) )
                    );
                }

            // Draw the actual number
            ctx!.font = 'bold ' + scale( indicesFontSize.value ) + 'px ' + indicesFontFamily.value;
            ctx!.fillStyle = col;

            ctx!.fillText(
                toDisplay,
                scale( originalToCanvasCoordinates( fixation.x! + fixationRadius.value, 'x' ) ) + totalOffset,
                scale( originalToCanvasCoordinates( fixation.y! - fixationRadius.value, 'y' ) )
            );

            totalOffset += width;
        }
    };

    watch( [
        fixationIndexDisplay,
        selectedFixationColor,
        unassignedFixationColor,
        machineAssignedFixationColor,
        fixationDisplay,
        selectedFixation,
        dropShadowOpacityStart,
        dropShadowOpacityEnd,
        dropShadowPasses,
        dropShadowSize
    ], render );

    onMounted( () => {
        ctx = indicesCanvas.value!.getContext( '2d' )!;
        render();
    } );

    return {
        render
    };
};

const getCorrectFilterFunction = (): ( val: EditorFixation, idx: number ) => boolean => {
    if ( fixationDisplay.value === 'all' ) return () => true;
    else if ( fixationDisplay.value === 'assigned' ) return filterAssigned;
    else if ( fixationDisplay.value === 'unassigned' ) return filterUnassigned;
    else if ( fixationDisplay.value === 'surrounding' ) return filterSurrounding;
    else return () => false;
};

const filterAssigned = ( val: EditorFixation ): boolean => {
    return val.assigned === 'assigned' || val.assigned === 'machine';
};

const filterUnassigned = ( val: EditorFixation ): boolean => {
    return val.assigned === 'unassigned';
};

const filterSurrounding = ( _val: EditorFixation, idx: number ): boolean => {
    return idx === selectedFixation.value - 1 || idx === selectedFixation.value + 1 || idx === selectedFixation.value;
};
