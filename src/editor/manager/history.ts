import type {
    AnnotationManager,
    HistoryEntry
} from '../types/history';
import {
    type Ref,
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import {
    fixations,
    selectedFixation
} from '../data';
import type {
    EditorAnnotation
} from '../types/annotation';
import type {
    Renderer
} from '../types/renderer';
import {
    revision
} from './save';

export const redoHistory: Ref<HistoryEntry[]> = ref( [] );

export const undoHistory: Ref<HistoryEntry[]> = ref( [] );


/**
 * DO NOT CALL!
 */
const startHistoryTracker = ( renderer: Renderer, annotation: AnnotationManager ) => {
    const clearRedo = () => {
        redoHistory.value = [];
    };

    const clear = () => {
        clearRedo();
        undoHistory.value = [];
    };

    const redo = () => {
        if ( redoHistory.value.length === 0 ) return;

        const last = redoHistory.value.pop()!;

        revision.value++;

        undoHistory.value.push( last );
        selectedFixation.value = last.selectedFixation;
        annotation.create( last.annotation.boxId, last.annotation.fixationId, true, false );

        if ( last.annotation.boxId !== undefined ) {
            fixations.value[ last.annotation.fixationId ]!.assigned = 'assigned';
        } else {
            fixations.value[ last.annotation.fixationId ]!.assigned = 'unassigned';
        }
    };

    const add = ( annotation: EditorAnnotation, selectedFixation: number ) => {
        revision.value++;

        undoHistory.value.push( {
            'annotation': {
                ...annotation
            },
            'selectedFixation': selectedFixation
        } );
        clearRedo();
    };

    const undo = () => {
        if ( undoHistory.value.length === 0 ) return;

        const last = undoHistory.value.pop()!;

        revision.value--;

        redoHistory.value.push( last );

        // Check that everything still works properly
        annotation.deleteByFixID( last.annotation.fixationId );

        if ( last.annotation.boxId !== undefined ) {
            fixations.value[ last.annotation.fixationId ]!.assigned = 'assigned';
        } else {
            fixations.value[ last.annotation.fixationId ]!.assigned = 'unassigned';
        }

        selectedFixation.value = last.selectedFixation + 1;

        renderer.renderLines.render();
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:undo', undo );
        document.addEventListener( 'eyetap:redo', redo );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:undo', undo );
        document.removeEventListener( 'eyetap:redo', redo );
    } );

    return {
        add,
        clearRedo,
        clear
    };
};

export {
    startHistoryTracker
};
