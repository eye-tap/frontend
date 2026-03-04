import {
    type Ref, ref
} from 'vue';
import type {
    Color
} from './types/boxes';
import type {
    EditorPoint
} from './types/annotation';

const r = document.querySelector( ':root' )!;
const rs = getComputedStyle( r );

// ┌                                               ┐
// │                    General                    │
// └                                               ┘
export const disableKeyHandler = ref( false );

export const moveThresholdForDrag = 3;

export const nearbyBoxesDistanceThreshold = ref( 20 );

export const autoSaveInterval = ref( 60000 );



// ┌                                               ┐
// │                     Zoom                      │
// └                                               ┘
export const referenceCanvasSize = {
    'width': 1920,
    'height': 1080
};

export const keyboardZoomStep = ref( 0.25 );

export const keyboardZoomPanStep: Ref<EditorPoint> = ref( {
    'x': 20,
    'y': 20
} );

export const zoomScrollWheelDivideFactor = ref( 100 );

export const overScrollDistanceForZoom = ref( 20 );



// ┌                                               ┐
// │                Background Text                │
// └                                               ┘
export const unfocusedTextColor: Ref<Color> = ref( {
    'r': 175,
    'g': 175,
    'b': 175
} );



// ┌                                               ┐
// │                Bounding boxes                 │
// └                                               ┘
export const boundingBoxesOpacity = ref( 1 );

export const boundingBoxOnHoverRadius = ref( 100 );

export const boxesDisplayOptions = [
    'always',
    'proximity',
    'hovered',
    'letters',
    'never'
] as const;

export type BoxesDisplay = typeof boxesDisplayOptions[number];

export const boxesDisplay = ref<BoxesDisplay>( 'letters' );

// Color
export const boundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3' ) );

export const highlightedBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const proximityBoundingBoxColor = ref( rs.getPropertyValue( '--theme-bg-3-20' ) );

export const hoveredTextColor: Ref<Color> = ref( {
    'r': 0,
    'g': 0,
    'b': 0
} );

export const boundingBoxStrokeWidth = ref( 2 );



// ┌                                               ┐
// │                   Fixations                   │
// └                                               ┘
export const fixationsOpacity = ref( 1 );

/*
 * Renders a colour based on heat map instead of the default colour.
 * Only affects non-selected and non-hovered and machine-assigned fixations
*/
export const renderFixationHeatMapInsteadOfDefaultColour = ref( true );

export const fixationDisplayOptions = [
    'all',
    'assigned',
    'unassigned',
    'surrounding',
    'none'
] as const;

export type FixationDisplay = typeof fixationDisplayOptions[number];

export const fixationDisplay = ref<FixationDisplay>( 'all' );

// Size
export const fixationRadius = ref( 5 );

export const hoveredFixationRadius = ref( 10 );

export const selectedFixationRadius = ref( 8 );

// Color
// 101, 242, 138 (theme-success)
export const heatMapMinColor: Ref<Color> = ref( {
    'r': 101,
    'g': 242,
    'b': 138
} );

// 226, 226, 86 (theme-information)
export const heatMapMidColor: Ref<Color> = ref( {
    'r': 226,
    'g': 226,
    'b': 86
} );

// 234, 115, 115 (theme-warning)
export const heatMapMaxColor: Ref<Color> = ref( {
    'r': 234,
    'g': 115,
    'b': 115
} );

// Make this keep the entropy color
export const selectedFixationColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const assignedFixationColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );

export const unassignedFixationColor = ref( rs.getPropertyValue( '--theme-warning' ) );

// Ideally current entropy color, but ~20% brighter
export const hoveredFixationColor = ref( rs.getPropertyValue( '--theme-bg-4-shade' ) );

// likely not used anymore
export const machineAssignedFixationColor = ref( rs.getPropertyValue( '--theme-bg-3' ) );

// Heat map config
export const heatMapMinValue = ref( 0 );

export const heatMapMidValue = ref( 0.5 );

export const heatMapMaxValue = ref( 1 );



// ┌                                               ┐
// │                    Indices                    │
// └                                               ┘
export const indicesOpacity = ref( 1 );

export const fixationIndexDisplayOptions = [
    'always',
    'surrounding',
    'none'
] as const;

export type FixationIndexDisplay
    = typeof fixationIndexDisplayOptions[number];

export const fixationIndexDisplay
    = ref<FixationIndexDisplay>( 'surrounding' );

export const indicesFontSize = ref( 14 );

export const indicesFontFamily = ref( 'sans-serif' );

// Drop shadow
// FIXME: Styling (for all the below)
export const dropShadowSize = ref( 2 ); // Zero disables it

export const dropShadowInnerSize = ref( 1 );

export const dropShadowPasses = ref( 20 );

export const dropShadowOpacityStart = ref( 1 );

export const dropShadowOpacityEnd = ref( 0 );

export const dropShadowMinBoldness = ref( 200 );

export const dropShadowMaxBoldness = ref( 2000 );

export const dropShadowOffsetX = ref( 0 );

export const dropShadowOffsetY = ref( 1 );



// ┌                                               ┐
// │                   Scan Path                   │
// └                                               ┘
// FIXME: If you want to render the scan path more in the fore- or background,
// move the canvas up/down src/editor/components/EditorView.vue
export const scanpathOpacity = ref( 1 );

export const numberOfFixationsToConnectInScanPathRendering = ref( 10 );

export const renderScanPath = ref( true );

export const scanPathLineWidth = ref( 1 );

// FIXME: Color
export const scanPathLineColor = ref( rs.getPropertyValue( '--theme-warning-shade' ) );


// ┌                                               ┐
// │                     Lines                     │
// └                                               ┘
export const linesOpacity = ref( 1 );

export const linesDisplayOptions = [
    'all',
    'previous',
    'allalgos',
    'none'
] as const;

export type LinesDisplay = typeof linesDisplayOptions[number];

export const linesDisplay = ref<LinesDisplay>( 'previous' );

export const lineWidth = ref( 3 );

// FIXME: Size
export const machineAssignedLineWidth = ref( 1 );

// Color
export const assignedLineColor = ref( rs.getPropertyValue( '--theme-information-shade' ) );

// FIXME: Color
export const machineAssignedLineColor = ref( rs.getPropertyValue( '--theme-warning-shade' ) );

export const cursorLineColor = ref( rs.getPropertyValue( '--theme-bg-4' ) );
