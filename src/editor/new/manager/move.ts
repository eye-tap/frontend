import {
    isMouseDragging,
    mousePos
} from '../data/io';
import type {
    EditorPoint
} from '../types/annotation';
import type {
    Renderer
} from '../types/renderer';
import {
    boxHighlightHandler
} from './boxes';
import {
    fixationHighlightHandler
} from './fixations';
import {
    watch
} from 'vue';

export const mouseMoveHandler = ( renderer: Renderer ) => {
    const b = boxHighlightHandler( renderer );

    const moveHandler = ( pos: EditorPoint ) => {
        if ( isMouseDragging.value ) {
            // Only boxes are affected
            b( pos );
        } else {
            // Points have priority over boxes
            b( pos, fixationHighlightHandler( pos ) );
        }
    };

    watch( mousePos, moveHandler );
};
