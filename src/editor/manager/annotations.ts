import {
    annotations,
    fixations,
    selectedFixation
} from '../data';
import type {
    AnnotationManager
} from '../types/history';
import type {
    EditorAnnotation
} from '../types/annotation';
import type {
    Renderer
} from '../types/renderer';
import {
    startHistoryTracker
} from './history';

export const annotationManager = ( renderer: Renderer ): AnnotationManager => {
    /**
     * Create an annotation. Automatically starts a redraw
     * @param boundingBoxIndex - The index of the bounding box
     * @param fixationIndex - The index of the fixation
     */
    const create = ( boundingBoxIndex: number, fixationIndex: number, skipHistory: boolean = false ) => {
        if (
            boundingBoxIndex > -1 && fixationIndex > -1
        ) {
            const annotation: EditorAnnotation = {
                'fixationId': fixationIndex,
                'boxId': boundingBoxIndex
            };

            annotations.value.push( annotation );

            // Add to history
            if ( !skipHistory )
                history.add( annotation, fixationIndex );

            // Advance to next element
            const length = fixations.value.length;
            const nextIndex = fixationIndex;
            for (let i = 1; i < length; i++) {
                let nextIndex = (fixationIndex + i) % length;

                if (fixations.value[nextIndex]!.assigned !== 'assigned') {
                    selectedFixation.value = nextIndex;
                    //TODO: trigger end of annotation 
                    break; 
                }
            }   


            fixations.value[ fixationIndex ]!.assigned = 'assigned';

            renderer.renderLines.render();
        }
    };

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param fixationId - The fixationId to remove for
     */
    const deleteByFixID = ( fixationId: number ) => {
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

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param boxId - The boxId to remove for
     */
    const deleteByBoxID = ( boxId: number ) => {
        let idx = -1;

        for ( let i = 0; i < annotations.value.length; i++ ) {
            if ( annotations.value[ i ]!.boxId === boxId ) {
                idx = i;
                break;
            }
        }

        if ( idx > -1 ) {
            annotations.value.splice( idx, 1 );
        }
    };

    const funcs: AnnotationManager = {
        create,
        deleteByFixID,
        deleteByBoxID
    };
    const history = startHistoryTracker( renderer, funcs );

    return funcs;
};
