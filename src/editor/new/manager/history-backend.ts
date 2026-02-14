import {
    type Ref,
    ref
} from 'vue';
import {
    selectedFixation,
    annotations,
    fixations
} from '../data';
import {
    revision
} from '@/editor/save';
import type { EditorAnnotation } from '../types/annotation';


interface HistoryEntry {
    annotation: EditorAnnotation;
    selectedFixation: number;
}

export const redoHistory: Ref<HistoryEntry[]> = ref( [] );

export const undoHistory: Ref<HistoryEntry[]> = ref( [] );


const clearRedo = () => {
    redoHistory.value = [];
};

const redo = ( redraw: () => void ) => {
    if ( redoHistory.value.length === 0 ) return;

    const last = redoHistory.value.pop()!;

    revision.value++;
    
    undoHistory.value.push( {
        'annotation': annotations.value[last.annotation.fixationId]!,
        'selectedFixation': selectedFixation.value
    } );
    annotations.value[ last.annotation.fixationId ] = last.annotation;
    selectedFixation.value = last.selectedFixation;
    if (last.annotation.boxId !== undefined) {
        fixations.value[ last.annotation.fixationId ]!.assigned = 'assigned';
    } else {
        fixations.value[ last.annotation.fixationId ]!.assigned = 'unassigned';
    }
    redraw();


};

const addToHistory = ( annotation: EditorAnnotation, selectedFixation: number ) => {
    revision.value++;


    undoHistory.value.push( {
        'annotation': annotation,
        'selectedFixation': selectedFixation,
    } );
    clearRedo();
};

const undo = ( redraw: () => void ) => {
    if ( undoHistory.value.length === 0 ) return;

    const last = undoHistory.value.pop()!;

    revision.value--;

    redoHistory.value.push( {
        'annotation': annotations.value[last.annotation.fixationId]!,
        'selectedFixation': selectedFixation.value
    } );

    annotations.value[ last.annotation.fixationId ] = last.annotation;

    if (last.annotation.boxId !== undefined) {
        fixations.value[ last.annotation.fixationId ]!.assigned = 'assigned';
    } else {
        fixations.value[ last.annotation.fixationId ]!.assigned = 'unassigned';
    }

    selectedFixation.value = last.selectedFixation;

    redraw();
};


export {
    clearRedo,
    redo,
    undo,
    addToHistory
};
