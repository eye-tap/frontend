import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    assignedFixationColor,
    fixationIndexDisplay,
    fixationRadius,
    machineAssignedFixationColor,
    selectedFixationColor,
    unassignedFixationColor
} from '../config';
import {
    canvasSize,
    fixations,
    selectedFixation
} from '../data';
import type {
    EditorFixation
} from '../types/fixations';
import {
    scale
} from './scaling';

export const indicesRenderer = ( indicesCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;

        // Render points
        if ( fixationIndexDisplay.value === 'always' || fixationIndexDisplay.value === 'surrounding' ) {
            fixations.value.forEach( ( fix, idx ) => {
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
        }
    };

    const draw = ( fixation: EditorFixation, idx: number, col: string ) => {
        ctx!.fillStyle = col;
        // TODO: Positioning?
        ctx!.fillText(
            ( idx + 1 ).toString(),
            scale( fixation.x! ) + scale( fixationRadius.value ),
            scale( fixation.y! ) - scale( fixationRadius.value )
        );
    };

    watch( [
        fixationIndexDisplay,
        selectedFixationColor,
        unassignedFixationColor,
        machineAssignedFixationColor
    ], render );

    onMounted( () => {
        ctx = indicesCanvas.value!.getContext( '2d' )!;
        render();
    } );

    return {
        render
    };
};
