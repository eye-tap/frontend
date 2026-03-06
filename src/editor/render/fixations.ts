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
    heatMapMaxColor,
    heatMapMaxValue,
    heatMapMidColor,
    heatMapMidValue,
    heatMapMinColor,
    heatMapMinValue,
    hoveredFixationColor,
    hoveredFixationRadius,
    invalidFixationColor,
    invalidFixationCrossLineWidth,
    machineAssignedFixationColor,
    renderFixationHeatMapInsteadOfDefaultColour,
    renderScanPath,
    scanPathLineColor,
    scanPathLineWidth,
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
    Color
} from '../types/boxes';
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
                    draw( fix, idx, selectedFixationColor.value, selectedFixationRadius.value );
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
        hoveredFixation,
        assignedFixationColor,
        unassignedFixationColor,
        hoveredFixationColor,
        selectedFixationColor,
        machineAssignedFixationColor,
        renderScanPath,
        scanPathLineColor,
        scanPathLineWidth,
        invalidFixationCrossLineWidth,
        invalidFixationColor
    ], render );

    return {
        render
    };
};

const drawInvalid = ( ctx: CanvasRenderingContext2D ) => {
    return ( fix: EditorFixation, idx: number ) => {
        let radius = fixationRadius.value / Math.SQRT2;

        if ( idx === selectedFixation.value ) {
            radius = selectedFixationRadius.value / Math.SQRT2;
            ctx.fillStyle = selectedFixationColor.value;
        } else {
            ctx.fillStyle = invalidFixationColor.value;
        }

        ctx.lineWidth = invalidFixationCrossLineWidth.value;
        ctx.beginPath();
        ctx.moveTo(
            scale( originalToCanvasCoordinates( fix.x! + radius, 'x' ) ),
            scale( originalToCanvasCoordinates( fix.y! + radius, 'y' ) )
        );
        ctx.lineTo(
            scale( originalToCanvasCoordinates( fix.x! - radius, 'x' ) ),
            scale( originalToCanvasCoordinates( fix.y! - radius, 'y' ) )
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(
            scale( originalToCanvasCoordinates( fix.x! - radius, 'x' ) ),
            scale( originalToCanvasCoordinates( fix.y! + radius, 'y' ) )
        );
        ctx.lineTo(
            scale( originalToCanvasCoordinates( fix.x! + radius, 'x' ) ),
            scale( originalToCanvasCoordinates( fix.y! - radius, 'y' ) )
        );
        ctx.stroke();
    };
};

const drawPoint = ( ctx: CanvasRenderingContext2D ) => {
    const invalidDrawer = drawInvalid( ctx );

    return ( fixation: EditorFixation, idx: number, color: string, radius: number ) => {
        if ( fixation.assigned === 'invalid' ) return invalidDrawer( fixation, idx );

        if ( renderFixationHeatMapInsteadOfDefaultColour.value && fixation.assigned === 'machine' && fixation.disagreement !== undefined && selectedFixation.value !== idx ) {
            // Heat map rendering
            // Below splits up into the two segments on the colour scale
            if ( fixation.disagreement < heatMapMidValue.value ) {
                const percentage = fixation.disagreement / ( heatMapMidValue.value - heatMapMinValue.value );
                const col: Color = {
                    'r': heatMapMinColor.value.r + ( ( heatMapMidColor.value.r - heatMapMinColor.value.r ) * percentage ),
                    'g': heatMapMinColor.value.g + ( ( heatMapMidColor.value.g - heatMapMinColor.value.g ) * percentage ),
                    'b': heatMapMinColor.value.b + ( ( heatMapMidColor.value.b - heatMapMinColor.value.b ) * percentage )
                };

                ctx.fillStyle = `rgb( ${ col.r }, ${ col.g }, ${ col.b } )`;
            } else {
                const percentage = fixation.disagreement / ( heatMapMaxValue.value - heatMapMidValue.value );
                const col: Color = {
                    'r': heatMapMinColor.value.r + ( ( heatMapMaxColor.value.r - heatMapMidColor.value.r ) * percentage ),
                    'g': heatMapMinColor.value.g + ( ( heatMapMaxColor.value.g - heatMapMidColor.value.g ) * percentage ),
                    'b': heatMapMinColor.value.b + ( ( heatMapMaxColor.value.b - heatMapMidColor.value.b ) * percentage )
                };

                ctx.fillStyle = `rgb( ${ col.r }, ${ col.g }, ${ col.b } )`;
            }
        } else {
            ctx.fillStyle = color;
        }

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
    const invalidDrawer = drawInvalid( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, idx, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( idx === selectedFixation.value - 1 || idx === selectedFixation.value + 1 ) {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, idx, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'unassigned' ) {
                draw( fix, idx, unassignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, idx, machineAssignedFixationColor.value, fixationRadius.value );
            }
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, idx, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else {
            invalidDrawer( fix, idx );
        }
    };
};

const allFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );
    const invalidDrawer = drawInvalid( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, idx, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, idx, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, idx, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'unassigned' ) {
                draw( fix, idx, unassignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, idx, machineAssignedFixationColor.value, fixationRadius.value );
            } else {
                invalidDrawer( fix, idx );
            }
        }
    };
};

const assignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );
    const invalidDrawer = drawInvalid( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, idx, selectedFixationColor.value, selectedFixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, idx, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else {
            if ( fix.assigned === 'assigned' ) {
                draw( fix, idx, assignedFixationColor.value, fixationRadius.value );
            } else if ( fix.assigned === 'machine' ) {
                draw( fix, idx, machineAssignedFixationColor.value, fixationRadius.value );
            } else {
                invalidDrawer( fix, idx );
            }
        }
    };
};

const unassignedFixationsRenderer = ( ctx: CanvasRenderingContext2D ) => {
    const draw = drawPoint( ctx );
    const invalidDrawer = drawInvalid( ctx );

    return ( fix: EditorFixation, idx: number ) => {
        if ( idx === selectedFixation.value ) {
            draw( fix, idx, selectedFixationColor.value, fixationRadius.value );
        } else if ( hoveredFixation.value === idx ) {
            draw( fix, idx, hoveredFixationColor.value, hoveredFixationRadius.value );
        } else if ( fix.assigned === 'unassigned' ) {
            draw( fix, idx, unassignedFixationColor.value, fixationRadius.value );
        } else {
            invalidDrawer( fix, idx );
        }
    };
};
