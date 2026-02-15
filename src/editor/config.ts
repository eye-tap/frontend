import {
    ref
} from 'vue';


// Essentials
export const nearbyBoxesDistanceThreshold = ref( 20 );

export const overScrollDistanceForZoom = ref( 20 );


// Colors
export const assignedLineColor = ref( 'red' );

export const cursorLineColor = ref( 'black' );

export const boundingBoxColor = ref( 'grey' );

export const highlightedBoundingBoxColor = ref( 'red' );

export const proximityBoundingBoxColor = ref( 'blue' );

export const selectedFixationColor = ref( 'blue' );

export const assignedFixationColor = ref( 'green' );

export const unassignedFixationColor = ref( 'red' );

export const hoveredFixationColor = ref( 'red' );

export const machineAssignedFixationColor = ref( 'red' );
// TODO: Fixation index colours?


// Stroke width
export const boundingBoxStrokeWidth = ref( 2 );

export const fixationRadius = ref( 4 );

export const hoveredFixationRadius = ref( 8 );

export const selectedFixationRadius = ref( 6 );

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

export const hoveredTextColor = ref( {
    'r': 0,
    'g': 255,
    'b': 0
} );

export const boundingBoxesOpacity = ref( 1 );

export const fixationsOpacity = ref( 1 );

export const linesOpacity = ref( 1 );

export const indicesOpacity = ref( 1 );

// TODO: Resize offset recomputation doesn't work yet


// Settings
export const boxesDisplayOptions = [
    'always',
    'proximity',
    'hovered',
    'letters',
    'never'
] as const;

export type BoxesDisplay = typeof boxesDisplayOptions[number];

export const boxesDisplay = ref<BoxesDisplay>( 'letters' );


export const linesDisplayOptions = [
    'all',
    'previous',
    'none'
] as const;

export type LinesDisplay = typeof linesDisplayOptions[number];

export const linesDisplay = ref<LinesDisplay>( 'previous' );


export const fixationDisplayOptions = [
    'all',
    'assigned',
    'unassigned',
    'surrounding',
    'none'
] as const;

export type FixationDisplay = typeof fixationDisplayOptions[number];

export const fixationDisplay = ref<FixationDisplay>( 'all' );


export const fixationIndexDisplayOptions = [
    'always',
    'surrounding',
    'none'
] as const;

export type FixationIndexDisplay
    = typeof fixationIndexDisplayOptions[number];

export const fixationIndexDisplay
    = ref<FixationIndexDisplay>( 'surrounding' );
// Always will include current unless none

export const boundingBoxOnHoverRadius = ref( 100 );

/** Disables the keyboard handler until this is again set to false */
export const disableKeyHandler = ref( false );

export const moveThresholdForDrag = 3;
