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

        if ( last.action === 'delete' ) annotation.deleteByFixID( last.annotation.fixationIdx );
        else annotation.create( last.annotation.boxIdx, last.annotation.fixationIdx, true, false );

        if ( last.annotation.boxIdx !== undefined ) {
            fixations.value[ last.annotation.fixationIdx ]!.assigned = 'assigned';
        } else {
            fixations.value[ last.annotation.fixationIdx ]!.assigned = 'unassigned';
        }

        renderer.renderLines.render();
        renderer.renderFixations.render();
    };

    const add = ( annotation: EditorAnnotation, selectedFixation: number ) => {
        revision.value++;

        undoHistory.value.push( {
            'annotation': {
                ...annotation
            },
            'selectedFixation': selectedFixation,
            'action': 'add'
        } );
        clearRedo();
    };

    /**
     * Add a remove event to the history
     * @param annotation - The annotation that was removed
     * @param selectedFixation - The fixation that was selected
     */
    const remove = ( annotation: EditorAnnotation, selectedFixation: number ) => {
        revision.value++;

        undoHistory.value.push( {
            'annotation': {
                ...annotation
            },
            'selectedFixation': selectedFixation,
            'action': 'delete'
        } );
        clearRedo();
    };

    const undo = () => {
        if ( undoHistory.value.length === 0 ) return;

        const last = undoHistory.value.pop()!;

        revision.value--;

        redoHistory.value.push( last );

        if ( last.action === 'add' ) annotation.deleteByFixID( last.annotation.fixationIdx );
        else annotation.create( last.annotation.boxIdx, last.annotation.fixationIdx, true, false );

        if ( last.annotation.boxIdx !== undefined ) {
            fixations.value[ last.annotation.fixationIdx ]!.assigned = 'assigned';
        } else {
            fixations.value[ last.annotation.fixationIdx ]!.assigned = 'unassigned';
        }

        selectedFixation.value = last.selectedFixation + 1;

        renderer.renderLines.render();
        renderer.renderFixations.render();
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
        remove,
        clearRedo,
        clear
    };
};

export {
    startHistoryTracker
};
