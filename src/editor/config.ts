import {
    type Ref,
    ref
} from 'vue';
import type {
    Color
} from './types/boxes';

const r = document.querySelector( ':root' );
const rs = getComputedStyle( r );


// Essentials
export const nearbyBoxesDistanceThreshold = ref( 20 );

export const overScrollDistanceForZoom = ref( 20 );


// Colors
export const assignedLineColor = ref( rs.getPropertyValue( '--theme-bg-3' ) );

export const cursorLineColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const boundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3' ) );

export const highlightedBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const proximityBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3-20' ) );

export const selectedFixationColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const assignedFixationColor = ref( rs.getPropertyValue( '--theme-bg-2' ) );

export const unassignedFixationColor = ref( rs.getPropertyValue( '--theme-bg-3-20' ) );

export const hoveredFixationColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const machineAssignedFixationColor = ref( rs.getPropertyValue( '--theme-information' ) );

// Stroke width
export const boundingBoxStrokeWidth = ref( 2 );

export const fixationRadius = ref( 4 );

export const hoveredFixationRadius = ref( 8 );

export const selectedFixationRadius = ref( 6 );

export const lineWidth = ref( 1 );

export const indicesFontSize = ref( 12 );

export const indicesFontFamily = ref( 'sans-serif' );


// Scaling and Zoom
export const referenceCanvasSize = {
    'width': 1920,
    'height': 1080
};

export const zoomScrollWheelDivideFactor = ref( 100 );

// Opacity
export const unfocusedTextColor: Ref<Color> = ref( {
    'r': 128,
    'g': 128,
    'b': 128
} );

export const hoveredTextColor: Ref<Color> = ref( {
    'r': 0,
    'g': 0,
    'b': 0
} );

export const boundingBoxesOpacity = ref( 1 );

export const fixationsOpacity = ref( 1 );

export const linesOpacity = ref( 1 );

export const indicesOpacity = ref( 1 );


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

export const keyboardZoomStep = ref( 0.25 );

export const keyboardZoomPanStep: Ref<EditorPoint> = ref( {
    'x': 20,
    'y': 20
} );
