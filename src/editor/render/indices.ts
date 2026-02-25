import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    assignedFixationColor,
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
        if ( dropShadowSize.value > 0 && dropShadowPasses.value > 0 ) {
            const movePerIter = dropShadowSize.value / dropShadowPasses.value;
            const opacityPerStep = ( dropShadowOpacityStart.value - dropShadowOpacityEnd.value ) / dropShadowPasses.value;
            const fontScaleUpPerIter = 2 * movePerIter;

            for ( let i = 0; i < dropShadowPasses.value; i++ ) {
                const fontSize = scale( indicesFontSize.value + ( fontScaleUpPerIter * i ) );

                ctx!.font = fontSize + 'px ' + indicesFontFamily.value;
                ctx!.fillStyle = `rgba( 0, 0, 0, ${ dropShadowOpacityStart.value + ( opacityPerStep * i ) } )`;
                const aspect = ctx!.measureText( ( idx + 1 ).toString() ).width / fontSize;

                ctx!.fillText(
                    ( idx + 1 ).toString(),
                    scale( originalToCanvasCoordinates( ( fixation.x! + fixationRadius.value ) - ( movePerIter * i * aspect ), 'x' ) ),
                    scale( originalToCanvasCoordinates( ( fixation.y! - fixationRadius.value ) + ( movePerIter * i ), 'y' ) )
                );
            }
        }

        ctx!.font = 'bold ' + scale( indicesFontSize.value ) + 'px ' + indicesFontFamily.value;
        ctx!.fillStyle = col;

        ctx!.fillText(
            ( idx + 1 ).toString(),
            scale( originalToCanvasCoordinates( fixation.x! + fixationRadius.value, 'x' ) ),
            scale( originalToCanvasCoordinates( fixation.y! - fixationRadius.value, 'y' ) )
        );
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
