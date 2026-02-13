import type {
    Renderer
} from '../types/renderer';
import {
    isMouseDragging
} from '../data/io';
import {
    watch
} from 'vue';

export const mouseClickHandler = ( renderer: Renderer ) => {
    const clickHandler = ( state: boolean ) => {
        if ( state ) {
            // Boxes have priority over points
        } else {
            // Points have priority over boxes
        }
    };

    watch( isMouseDragging, clickHandler );
};
