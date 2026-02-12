import {
    type Ref,
    ref,
    watch
} from 'vue';
import type {
    Renderer
} from './types/renderer';


// Essentials
export const nearbyBoxesDistanceThreshold = ref( 20 );


// Colors
export const assignedLineColor = ref( 'red' );

export const cursorLineColor = ref( 'black' );

export const boundingBoxColor = ref( 'grey' );

export const highlightedBoundingBoxColor = ref( 'red' );

export const proximityBoundingBoxColor = ref( 'blue' );

export const unassignedFixationColor = ref( 'red' );

export const selectedFixationColor = ref( 'blue' );

export const assignedFixationColor = ref( 'green' );


// Stroke width
export const boundingBoxStrokeWidth = ref( 2 );

export const fixationRadius = ref( 4 );

export const lineWidth = ref( 1 );


// Scaling and Zoom
export const referenceCanvasSize = {
    'width': 1920,
    'height': 1080
};


// Opacity
export const unfocusedTextColor = ref( {
    'r': 255,
    'g': 0,
    'b': 0
} );

export const boundingBoxesOpacity = ref( 1 );

export const fixationsOpacity = ref( 1 );

export const linesOpacity = ref( 1 );

export const indicesOpacity = ref( 1 );

// Settings
export const fixationDisplay: Ref<'all' | 'assigned' | 'unassigned' | 'previous' | 'none'> = ref( 'all' );

export const boxesDisplay: Ref<'always' | 'proximity' | 'hovered' | 'letters' | 'never'> = ref( 'letters' );

export const linesDisplay: Ref<'all' | 'previous' | 'none'> = ref( 'previous' );

export const fixationIndexDisplay: Ref<'always' | 'next' | 'surrounding' | 'previous' | 'none'> = ref( 'previous' ); // Always will include current unless none

export const boundingBoxOnHoverRadius = ref( 100 );


// Watcher
export const useWatcher = ( renderer: Renderer ) => {
    watch( [
        nearbyBoxesDistanceThreshold,
        highlightedBoundingBoxColor,
        proximityBoundingBoxColor,
        boundingBoxColor,
        boundingBoxStrokeWidth,
        boundingBoxOnHoverRadius,
        boundingBoxesOpacity,
        unfocusedTextColor,
        boxesDisplay
    ], renderer.renderBoxes.render );
    watch( [
        unassignedFixationColor,
        selectedFixationColor,
        assignedFixationColor,
        fixationRadius,
        fixationsOpacity,
        indicesOpacity,
        fixationDisplay,
        fixationIndexDisplay
    ], renderer.renderFixations.render );
    watch( [
        assignedLineColor,
        cursorLineColor,
        lineWidth,
        linesOpacity,
        linesDisplay
    ], renderer.renderLines.render );
    watch( [ unfocusedTextColor ], renderer.renderText.render );
    watch( [ referenceCanvasSize ], renderer.renderAll );
};
