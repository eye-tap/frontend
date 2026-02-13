import {
    annotations,
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
    mouseClickPos,
    mousePos
} from '../data/io';
import type {
    Renderer
} from '../types/renderer';
import {
    getBoxIdFromCoordinate
} from '../association/boxes';
import {
    moveThresholdForDrag
} from '../config';
import {
    watch
} from 'vue';

export const mouseClickHandler = ( renderer: Renderer ) => {
    let selectedNewFixation = false;

    const clickHandler = ( state: boolean ) => {
        if ( state ) {
            if ( selectedFixation.value < 0 ) {
                selectedFixation.value = getClosestFixationIdByCoordinate( mousePos.value );
                selectedNewFixation = true;
            }

            const idx = getFixationIdByCoodianate( mousePos.value );

            if ( idx > -1 ) {
                selectedFixation.value = idx;
                selectedNewFixation = true;
            }

            lineStart.value = {
                'x': fixations.value[ selectedFixation.value ]!.x!,
                'y': fixations.value[ selectedFixation.value ]!.y!
            };

            renderer.renderIO.render();
        } else {
            const bb = getBoxIdFromCoordinate( mousePos.value );

            deleteAnnotation( selectedFixation.value );

            if (
                bb > -1
                && ( Math.sqrt( Math.pow( mouseClickPos.value.x, 2 ) + Math.pow( mouseClickPos.value.y, 2 ) ) < moveThresholdForDrag * 2
                    || selectedNewFixation )
            ) {
                annotations.value.push( {
                    'fixationId': selectedFixation.value,
                    'boxId': bb
                } );

                // TODO: History here, auto-advance
                fixations.value[ selectedFixation.value ]!.assigned = 'assigned';

                renderer.renderLines.render();
            }
        }
    };

    watch( isMouseDragging, clickHandler );
};

const deleteAnnotation = ( fixationId: number ) => {
    let idx = -1;

    for ( let i = 0; i < annotations.value.length; i++ ) {
        if ( annotations.value[ i ]!.fixationId === fixationId ) {
            idx = i;
            break;
        }
    }

    if ( idx > -1 ) {
        annotations.value.splice( idx, 1 );
    }
};
