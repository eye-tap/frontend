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
    FixationDto
} from '@/types/dtos/FixationDto';

export const fixations: Ref<FixationDto[]> = ref( [] );

export const boundingBoxes: Ref<EditorCharacterBoundingBox[]> = ref( [] );

export const annotations: Ref<EditorAnnotation[]> = ref( [] );

export const selectedFixation = ref( -1 );

export const canvasPosition = ref( {
    'x': 0,
    'y': 0
} );

export const zoomFactor = ref( 1 );

export const canvasSize = ref( {
    'height': 0,
    'width': 0
} );
