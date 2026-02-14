import {
    type Ref,
    ref
} from 'vue';
import type {
    EditorAnnotation
} from '../types/annotation';
import type {
    EditorCharacterBoundingBox
} from '../types/boxes';
import type {
    EditorFixation
} from '../types/fixations';
import {
    referenceCanvasSize
} from '../config';

export const fixations: Ref<EditorFixation[]> = ref( [] );

export const boundingBoxes: Ref<EditorCharacterBoundingBox[]> = ref( [] );

export const annotations: Ref<EditorAnnotation[]> = ref( [] );

export const selectedFixation = ref( -1 );

export const hoveredFixation = ref( -1 );


// Zoom utilities
export const canvasPosition = ref( {
    'x': 0,
    'y': 0
} );

export const zoomFactor = ref( 1 );

export const canvasSize = ref( {
    ...referenceCanvasSize
} );
