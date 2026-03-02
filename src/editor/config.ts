import {
    type Ref,
    ref
} from 'vue';
import type {
    Color
} from './types/boxes';
import type {
    EditorPoint
} from './types/annotation';

const r = document.querySelector( ':root' )!;
const rs = getComputedStyle( r );


// Essentials
export const nearbyBoxesDistanceThreshold = ref( 20 );

export const overScrollDistanceForZoom = ref( 20 );

export const autoSaveInterval = ref( 60000 );

// Colors
export const assignedLineColor = ref( rs.getPropertyValue( '--theme-information-shade' ) );

// TODO: Do we want this setting?
export const machineAssignedLineColor = ref( rs.getPropertyValue( '--theme-warning-shade' ) );

export const cursorLineColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const boundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3' ) );

export const highlightedBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const proximityBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3-20' ) );

export const selectedFixationColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const assignedFixationColor = ref( rs.getPropertyValue( '--theme-success' ) );

export const unassignedFixationColor = ref( rs.getPropertyValue( '--theme-warning' ) );

export const hoveredFixationColor = ref( rs.getPropertyValue( '--theme-bg-4-shade' ) );

export const machineAssignedFixationColor = ref( rs.getPropertyValue( '--theme-information' ) );


// Drop shadow for fixations. In pixels
export const dropShadowSize = ref( 2 ); // Zero disables it

export const dropShadowInnerSize = ref( 1 );

export const dropShadowPasses = ref( 20 );

export const dropShadowOpacityStart = ref( 1 );

export const dropShadowOpacityEnd = ref( 0 );

export const dropShadowMinBoldness = ref( 200 );

export const dropShadowMaxBoldness = ref( 2000 );

export const dropShadowOffsetX = ref( 0 );

export const dropShadowOffsetY = ref( 1 );


// Stroke width
export const boundingBoxStrokeWidth = ref( 2 );

export const fixationRadius = ref( 5 );

export const hoveredFixationRadius = ref( 10 );

export const selectedFixationRadius = ref( 8 );

export const lineWidth = ref( 3 );

export const machineAssignedLineWidth = ref( 1 );

export const indicesFontSize = ref( 14 );

export const indicesFontFamily = ref( 'sans-serif' );


// Scaling and Zoom
export const referenceCanvasSize = {
    'width': 1920,
    'height': 1080
};

export const zoomScrollWheelDivideFactor = ref( 100 );

// Opacity
export const unfocusedTextColor: Ref<Color> = ref( {
    'r': 175,
    'g': 175,
    'b': 175
} );

export const hoveredTextColor: Ref<Color> = ref( {
    'r': 0,
    'g': 0,
    'b': 0
} );

export const heatMapMinColor: Ref<Color> = ref( {
    'r': 0,
    'g': 0,
    'b': 0
} );

export const heatMapMidColor: Ref<Color> = ref( {
    'r': 0,
    'g': 0,
    'b': 0
} );

export const heatMapMaxColor: Ref<Color> = ref( {
    'r': 255,
    'g': 0,
    'b': 0
} );

export const heatMapMinValue = ref( 0 );

export const heatMapMidValue = ref( 0.5 );

export const heatMapMaxValue = ref( 1 );

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
    'surrounding', // TODO: this enables the config option below
    'allalgos',
    'none'
] as const;

export const numberOfLinesToRenderInSurroundingMode = ref( 10 );

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

/*
 * Renders a colour based on heat map instead of the default colour.
 * Only affects non-selected and non-hovered and machine-assigned fixations
*/
export const renderFixationHeatMapInsteadOfDefaultColour = ref( true );


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
