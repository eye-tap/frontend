import {
    type Ref,
    ref,
    watch
} from 'vue';


// Global config
const imageKey = 'text_image';
const bbKey = 'bounding_boxes';
const gazePointsKey = 'gaze_points';
// Essentials
const nearbyBoxesDistanceThreshold = ref( 20 );
const filterReader: Ref<number | null> = ref( null );
// Colors
const annotationLineColor = ref( 'rgba(245, 158, 11, 0.4)' );
const cursorLineColor = ref( 'rgba(245, 158, 11, 0.8)' );
const annotationPointColor = ref( '#718096' );
const hightlightedBoxColor = ref( '#2563EB' );
const proximityBoxColor = ref( '#93C5FD' );
const selectedPointColor = ref( '#2B6CB0' );
const assignedPointColor = ref( '#38A169' );
const boundingBoxColor = ref( '#CBD5E1' );
// Stroke width
const boundingBoxStrokeWidth = ref( 2 );
const pointRadius = ref( 4 );
const lineWidth = ref( 1 );
// Canvas size
const referenceCanvasSize = ref( {
    'width': 1920,
    'height': 1080
} );
// Toggles
const showAdvancedOptions = ref( false );
const showGazePoints = ref( true );
const showLines = ref( true );
const showBoxesOnHover = ref( false );
const boundingBoxOnHoverRadius = ref( 100 );
const showBoundingBoxes = ref( true );
const showHoveredBoundingBox = ref( true );
const showNearbyBoundingBoxes = ref( true );
const showPointIndex = ref( true );
const showOnlyPreviousPoints = ref( false );

const useWatcher = ( redraw: () => void ) => {
    watch( [
        filterReader,
        nearbyBoxesDistanceThreshold,
        annotationLineColor,
        cursorLineColor,
        annotationPointColor,
        hightlightedBoxColor,
        proximityBoxColor,
        selectedPointColor,
        assignedPointColor,
        boundingBoxColor,
        boundingBoxStrokeWidth,
        pointRadius,
        lineWidth,
        showGazePoints,
        showLines,
        showBoundingBoxes,
        showBoxesOnHover,
        showPointIndex,
        boundingBoxOnHoverRadius,
        showNearbyBoundingBoxes,
        showHoveredBoundingBox,
        showOnlyPreviousPoints,
        referenceCanvasSize
    ], redraw );
};

export {
    nearbyBoxesDistanceThreshold,
    filterReader,
    annotationLineColor,
    cursorLineColor,
    annotationPointColor,
    hightlightedBoxColor,
    proximityBoxColor,
    selectedPointColor,
    assignedPointColor,
    boundingBoxColor,
    boundingBoxStrokeWidth,
    pointRadius,
    lineWidth,
    showAdvancedOptions,
    showGazePoints,
    showLines,
    showBoundingBoxes,
    showBoxesOnHover,
    boundingBoxOnHoverRadius,
    showNearbyBoundingBoxes,
    showPointIndex,
    showOnlyPreviousPoints,
    showHoveredBoundingBox,
    referenceCanvasSize,
    useWatcher,
    imageKey,
    bbKey,
    gazePointsKey
};
