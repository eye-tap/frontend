import {
    fixations,
    selectedFixation
} from '../data';
import {
    getClosestFixationIdByCoordinate,
    getFixationIdByCoodianate
} from '../association/fixations';
import {
    isMouseDragging,
    lineStart,
    mousePos
} from '../data/io';
import type {
    Renderer
} from '../types/renderer';
import {
    annotationManager
} from './annotations';
import {
    getBoxIdFromCoordinate
} from '../association/boxes';
import {
    watch
} from 'vue';

export const mouseClickHandler = ( renderer: Renderer ) => {
    const annotation = annotationManager( renderer );

    const clickHandler = ( state: boolean ) => {
        if ( fixations.value.length <= 0 ) return;

        if ( state ) {
            // If no fixation was selected, select one
            if ( selectedFixation.value < 0 ) {
                selectedFixation.value = getClosestFixationIdByCoordinate( mousePos.value );
            }

            // Check if clicked a fixation directly
            const idx = getFixationIdByCoodianate( mousePos.value );

            if ( idx > -1 ) {
                selectedFixation.value = idx;
            }

            // Set line start for the line rendering to work
            lineStart.value = {
                'x': fixations.value[ selectedFixation.value ]!.x!,
                'y': fixations.value[ selectedFixation.value ]!.y!
            };

            renderer.renderIO.render();
        } else {
            // Get bounding box that was hovered at mouseUp
            const bb = getBoxIdFromCoordinate( mousePos.value );

            // Try to delete the annotation if it was present
            annotation.deleteByFixID( selectedFixation.value );

            annotation.create( bb, selectedFixation.value );
        }
    };

    watch( isMouseDragging, clickHandler );
};
