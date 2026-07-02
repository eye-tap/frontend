import {
    annotationManager,
    getPossibleAnnotations
} from './annotations';
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
    mouseDragEnd,
    mousePos
} from '../data/io';
import type {
    Renderer
} from '../types/renderer';
import {
    distanceBetweenPoints
} from '../util/arithmetic';
import {
    fixationRadius
} from '../config';
import {
    getBoxIdFromCoordinate
} from '../association/boxes';
import science from '@/ts/util/science';
import {
    watch
} from 'vue';

export const mouseClickHandler = ( renderer: Renderer ) => {
    const annotation = annotationManager( renderer );

    const clickHandler = ( state: boolean ) => {
        // This handles click state changes to click down
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
            const distance = distanceBetweenPoints( {
                'x': fixations.value[ selectedFixation.value ]!.x!,
                'y': fixations.value[ selectedFixation.value ]!.y!
            }, mouseDragEnd.value );

            if ( distance > fixationRadius.value ) {
                // Get bounding box that was hovered at mouseUp
                const bb = getBoxIdFromCoordinate( mousePos.value );

                if ( ( getPossibleAnnotations()?.length ?? 1 ) > 1 ) {
                    science.track( 'disagreement-solution-click' );
                }

                annotation.create( bb, selectedFixation.value );
            }
        }
    };

    watch( isMouseDragging, clickHandler );
};
