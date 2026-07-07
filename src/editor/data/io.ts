import {
    type Ref,
    ref
} from 'vue';
import type {
    EditorPoint
} from '../types/annotation';
import {
    allowDeclutterMode
} from '../config';

export const isMouseDragging = ref( false );


export const mousePos: Ref<EditorPoint> = ref( {
    'x': 0,
    'y': 0
} );

// Cursor line
export const mouseClickPos: Ref<EditorPoint> = ref( {
    'x': -1,
    'y': -1
} );

export const mouseDragEnd: Ref<EditorPoint> = ref( {
    'x': -1,
    'y': -1
} );

export const lineStart: Ref<EditorPoint> = ref( {
    'x': -1,
    'y': -1
} );

export const isZoomDragging = ref( false );

export const declutterEnabled = ref( false );

export const setDeclutter = ( status: boolean ) => {
    if ( allowDeclutterMode.value )
        declutterEnabled.value = status;
    else
        declutterEnabled.value = false;
};
