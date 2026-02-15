import {
    type Ref,
    onMounted,
    watch
} from 'vue';
import {
    assignedFixationColor,
    fixationDisplay,
    fixationRadius,
    fixationsOpacity,
    hoveredFixationColor,
    hoveredFixationRadius,
    machineAssignedFixationColor,
    selectedFixationColor,
    selectedFixationRadius,
    unassignedFixationColor
} from '../config';
import {
    canvasSize,
    fixations,
    hoveredFixation,
    selectedFixation
} from '../data';
import {
    originalToCanvasCoordinates,
    scale
} from './scaling';
import type {
    EditorFixation
} from '../types/fixations';

export const fixationRenderer = ( fixationsCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;

        // Reset canvas
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.canvas.width = canvasSize.value.width;
        ctx.canvas.height = canvasSize.value.height;
        ctx.globalAlpha = fixationsOpacity.value;

        // Render points
        if ( fixationDisplay.value === 'all' ) {
            fixations.value.forEach( allFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'surrounding' ) {
            fixations.value.forEach( surroundingFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'assigned' ) {
            fixations.value.forEach( assignedFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'unassigned' ) {
            fixations.value.forEach( unassignedFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'none' ) {
            const draw = drawPoint( ctx );

            fixations.value.forEach( ( fix, idx ) => {
                if ( idx === selectedFixation.value )
                    draw( fix, selectedFixationColor.value, selectedFixationRadius.value );
            } );
        }
    };

    onMounted( () => {
        ctx = fixationsCanvas.value!.getContext( '2d' )!;
        render();
    } );

    watch( [
        fixationDisplay,
        fixationRadius,
        fixationsOpacity,
        fixationRadius,
        selectedFixation,
        hoveredFixation
    ], render );

    return {
        render
    };
};

const drawPoint = ( ctx: CanvasRenderingContext2D ) => {
    return ( fixation: EditorFixation, color: string, radius: number ) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
            scale( originalToCanvasCoordinates( fixation.x!, 'x' ) ),
            scale( originalToCanvasCoordinates( fixation.y!, 'y' ) ),
            scale( radius ),
            0,
            Math.PI * 2
        );
        ctx.fill();
    };
};

const surroundingFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( idx === selectedFixation.value - 1 || idx === selectedFixation.value + 1 ) {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'unassigned' ) {
                draw( fix, unassignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, machineAssignedFixationColor.value, fixationRadius.value );
            }
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, hoveredFixationColor.value, hoveredFixationRadius.value );
        }
    };
};

const allFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'unassigned' ) {
                draw( fix, unassignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, machineAssignedFixationColor.value, fixationRadius.value );
            }
        }
    };
};

const assignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, machineAssignedFixationColor.value, fixationRadius.value );
            }
        }
    };
};

const unassignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, selectedFixationColor.value, fixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else if ( fix.assigned === 'unassigned' ) {
            draw( fix, unassignedFixationColor.value, fixationRadius.value );
        }
    };
};
