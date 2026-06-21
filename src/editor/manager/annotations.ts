import {
    annotations,
    fixations,
    machineAnnotations,
    selectedFixation
} from '../data';
import {
    onMounted,
    onUnmounted
} from 'vue';
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
    goToNextFixation
} from './fixations';
import {
    highlightBox
} from './boxes';
import {
    startHistoryTracker
} from './history';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

let manager: AnnotationManager | null = null;

export const annotationManager = ( renderer: Renderer ): AnnotationManager => {
    if ( !manager ) {
        manager = startAnnotationManager( renderer );
    }

    return manager;
};

const startAnnotationManager = ( renderer: Renderer ): AnnotationManager => {
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
     * Confirm an annotation to be the one from the algorithm, as suggested
     * @param skipHistory - Whether or not to skip adding action to history
     * @param highlight - Whether or not to highlight the changed box
     */
    const confirmAnnotation = ( skipHistory: boolean = false, highlight: boolean = false ) => {
        const annotation = getAnnotationToConfirm();

        if ( annotation )
            try {
                create(
                    annotation!.boxIdx,
                    selectedFixation.value,
                    skipHistory,
                    highlight
                );
            } catch { /* empty */ }
    };

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param fixationId - The fixationId to remove for
     */
    const deleteByFixID = ( fixationId: number, addActionToHistory: boolean = false ): boolean => {
        if ( fixations.value[ fixationId ]!.assigned === 'assigned' ) {
            for ( let i = 0; i < annotations.value.length; i++ ) {
                if ( annotations.value[ i ]!.fixationIdx === fixationId && !annotations.value[ i ]!.algorithm ) {
                    // Found fixation, delete it, add to history and redraw screen
                    const d = annotations.value.splice( i, 1 );

                    if ( addActionToHistory ) {
                        history.remove( d[ 0 ]!, selectedFixation.value, fixations.value[ fixationId ]!.assigned );
                    }

                    // Mark as machine annotated, if there exists a machine annotation, and as unassigned if not.
                    if ( machineAnnotations.value[ fixationId ]!.length > 0 )
                        fixations.value[ fixationId ]!.assigned = 'machine';
                    else
                        fixations.value[ fixationId ]!.assigned = 'unassigned';

                    renderer.renderIndices.render();
                    renderer.renderFixations.render();
                    renderer.renderLines.render();

                    highlightBox( d[ 0 ]!.boxIdx, 3000 );

                    return true;
                }
            }
        }

        return false;
    };

    /**
     * Delete an annotation by fixation ID. Note that it will not re-render
     * @param boxId - The boxId to remove for
     */
    const deleteByBoxID = ( boxId: number ) => {
        let idx = -1;

        for ( let i = 0; i < annotations.value.length; i++ ) {
            if ( annotations.value[ i ]!.boxIdx === boxId ) {
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

    /**
     * Mark a fixation as invalid
     * @param fixationIndex - The fixation to mark
     */
    const markAsInvalid = ( fixationIndex: number ) => {
        goToNextFixation();

        if ( !deleteByFixID( fixationIndex, true ) ) history.invalidate( fixationIndex, fixations.value[ fixationIndex ]!.assigned );

        fixations.value[ fixationIndex ]!.assigned = 'invalid';
    };

    const funcs: AnnotationManager = {
        create,
        markAsInvalid,
        deleteByFixID,
        deleteByBoxID,
        confirmAnnotation
    };
    const history = startHistoryTracker( renderer, funcs );

    onMounted( () => {
        document.addEventListener( 'eyetap:keys:invalid', ( ev: CustomEvent ) => markAsInvalid( ev.detail ) );
    } );
    onUnmounted( () => {
        document.addEventListener( 'eyetap:keys:invalid', ( ev: CustomEvent ) => markAsInvalid( ev.detail ) );
    } );

    return funcs;
};

export const getAnnotationToConfirm = () => {
    const candidates = getPossibleAnnotations();

    // Compare against first's block idx
    if ( !candidates || candidates.length === 0 ) return;

    const firstBox = candidates[0]!.boxIdx;
    const check = !candidates
        .some( val => val.boxIdx !== firstBox );

    return check
        ? candidates[0]!
        : undefined;
};

export const getPossibleAnnotations = () => {
    const candidates = machineAnnotations.value
        .filter( val => val.fixationIdx === selectedFixation.value );

    console.log( candidates );

    return candidates;
};
