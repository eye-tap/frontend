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
    machineAssignedFixationColor,
    selectedFixationColor,
    unassignedFixationColor
} from '../config';
import {
    canvasSize,
    fixations
} from '../data';
import type {
    EditorFixation
} from '../types/fixations';
import {
    scale
} from './scaling';

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
        if ( fixationDisplay.value === 'all' || fixationDisplay.value === 'surrounding' ) {
            fixations.value.forEach( allFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'assigned' ) {
            fixations.value.forEach( assignedFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'unassigned' ) {
            fixations.value.forEach( unassignedFixationsRenderer( ctx ) );
        } else if ( fixationDisplay.value === 'none' ) {
            const draw = drawPoint( ctx );

            fixations.value.forEach( fix => {
                if ( fix.highlightClass === 'selected' )
                    draw( fix, selectedFixationColor.value );
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
        fixationRadius
    ], render );

    return {
        render
    };
};

const drawPoint = ( ctx: CanvasRenderingContext2D ) => {
    return ( fixation: EditorFixation, col: string ) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc( scale( fixation.x! ), scale( fixation.y! ), scale( fixationRadius.value ), 0, Math.PI * 2 );
        ctx.fill();
    };
};

const allFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation ) => {
        if ( fix.highlightClass === 'selected' ) {
            draw( fix, selectedFixationColor.value );
        } else if ( fix.highlightClass === 'unassigned' ) {
            draw( fix, unassignedFixationColor.value );
        } else if ( fix.highlightClass === 'assigned' ) {
            draw( fix, assignedFixationColor.value );
        } else if ( fix.highlightClass === 'machine' ) {
            draw( fix, machineAssignedFixationColor.value );
        }
    };
};

const assignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation ) => {
        if ( fix.highlightClass === 'selected' ) {
            draw( fix, selectedFixationColor.value );
        } else if ( fix.highlightClass === 'assigned' ) {
            draw( fix, assignedFixationColor.value );
        } else if ( fix.highlightClass === 'machine' ) {
            draw( fix, machineAssignedFixationColor.value );
        }
    };
};

const unassignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );

    return ( fix: EditorFixation ) => {
        if ( fix.highlightClass === 'selected' ) {
            draw( fix, selectedFixationColor.value );
        } else if ( fix.highlightClass === 'assigned' ) {
            draw( fix, unassignedFixationColor.value );
        }
    };
};
