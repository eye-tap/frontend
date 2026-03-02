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
    highlightBox
} from './boxes';
import {
    startHistoryTracker
} from './history';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const annotationManager = ( renderer: Renderer ): AnnotationManager => {
    const session = useAnnotationSessionStore();

    /**
     * Create an annotation. Automatically starts a redraw
     * @param boundingBoxIndex - The index of the bounding box
     * @param fixationIndex - The index of the fixation
     */
    const create = ( boundingBoxIndex: number, fixationIndex: number, skipHistory: boolean = false, highlight: boolean = false ) => {
        if (
            boundingBoxIndex > -1 && fixationIndex > -1
        ) {
            const annotation: EditorAnnotation = {
                'fixationIdx': fixationIndex,
                'boxIdx': boundingBoxIndex
            };

            // Try to delete by fix id
            deleteByFixID( annotation.fixationIdx );

            annotations.value.push( annotation );

            // Add to history
            if ( !skipHistory )
                history.add( annotation, fixationIndex, fixations.value[ fixationIndex ]!.assigned );

            if ( highlight )
                highlightBox( boundingBoxIndex, 1000 );

            // Advance to next element
            const length = fixations.value.length;

            let endOfAnnotations = true;

            for ( let i = 1; i < length; i++ ) {
                const nextIndex = ( fixationIndex + i ) % length;

                if ( fixations.value[nextIndex]!.assigned !== 'assigned' && fixations.value[nextIndex]!.assigned !== 'invalid' ) {
                    selectedFixation.value = nextIndex;
                    endOfAnnotations = false;
                    break;
                }
            }

            if ( endOfAnnotations ) {
                document.dispatchEvent( new CustomEvent( 'eyetap:annotation-done', {
                    'detail': {
                        'current': session.sessionIds[ session.sessionIdx ]!.sessionId,
                        'next': session.sessionIds[ session.sessionIdx + 1 ]!.sessionId
                    }
                } ) );
                selectedFixation.value = -1;
            }


            fixations.value[ fixationIndex ]!.assigned = 'assigned';

            renderer.renderLines.render();
        }
    };

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param fixationId - The fixationId to remove for
     */
    const deleteByFixID = ( fixationId: number, addActionToHistory: boolean = false ) => {
        let idx = -1;

        if ( fixations.value[ fixationId ]!.assigned === 'assigned' ) {
            for ( let i = 0; i < annotations.value.length; i++ ) {
                if ( annotations.value[ i ]!.fixationIdx === fixationId && !annotations.value[ i ]!.algorithm ) {
                    idx = i;
                    break;
                }
            }

            if ( idx > -1 ) {
                const d = annotations.value.splice( idx, 1 );

                console.log( 'Removing annotation', d, 'with fix idx', fixationId );


                if ( addActionToHistory ) {
                    history.remove( d[ 0 ]!, selectedFixation.value, fixations.value[ fixationId ]!.assigned );
                }

                fixations.value[ fixationId ]!.assigned = 'unassigned';

                renderer.renderIndices.render();
                renderer.renderFixations.render();
                renderer.renderLines.render();

                highlightBox( d[ 0 ]!.boxIdx, 3000 );
            }
        }
    };

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param boxId - The boxId to remove for
     */
    const deleteByBoxID = ( boxId: number ) => {
        let idx = -1;

        for ( let i = 0; i < annotations.value.length; i++ ) {
            if ( annotations.value[ i ]!.boxIdx === boxId && !annotations.value[ i ]!.algorithm ) {
                idx = i;
                break;
            }
        }

        if ( idx > -1 ) {
            if ( fixations.value[ annotations.value[ idx ]!.fixationIdx ]!.assigned === 'assigned' ) {
                const d = annotations.value.splice( idx, 1 );

                highlightBox( d[ 0 ]!.boxIdx, 3000 );
            }
        }
    };

    const markAsInvalid = ( fixationIndex: number ) => {
        fixations.value[ fixationIndex ]!.assigned = 'invalid';
        deleteByFixID( fixationIndex, true );
    };

    const funcs: AnnotationManager = {
        create,
        markAsInvalid,
        deleteByFixID,
        deleteByBoxID
    };
    const history = startHistoryTracker( renderer, funcs );

    return funcs;
};
