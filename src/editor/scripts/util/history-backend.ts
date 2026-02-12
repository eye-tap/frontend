import {
    type Ref,
    ref
} from 'vue';
import {
    filteredPoints,
    selectedPoint
} from '../internal-data';
import {
    revision
} from '@/editor/save';

interface RedoHistoryEntry {
    'pointindex': number;
    'annotatedBox': string | number | null;
    'selectedPointIndex': number;
}
interface UndoHistoryEntry {
    'pointindex': number;
    'annotatedBox': string | number | null;
    'selectedPointIndex': number;
}

export const redoHistory: Ref<RedoHistoryEntry[]> = ref( [] );

export const undoHistory: Ref<UndoHistoryEntry[]> = ref( [] );


const clearRedo = () => {
    redoHistory.value = [];
};

const redo = ( redraw: () => void ) => {
    if ( redoHistory.value.length === 0 ) return;

    const last = redoHistory.value.pop()!;


    revision.value++;

    const point = filteredPoints.value[ last.pointindex ];

    undoHistory.value.push( {
        'pointindex': last.pointindex,
        'annotatedBox': point?.annotedbox ?? null,
        'selectedPointIndex': selectedPoint.value ? filteredPoints.value.indexOf( selectedPoint.value ) : -1
    } );
    selectedPoint.value = filteredPoints.value[ last.selectedPointIndex ]!;

    if ( point ) {
        point.annotedbox = last.annotatedBox;
        redraw();
    }
};

const addToHistory = ( index: number, selectedPointindex: number ) => {
    revision.value++;


    undoHistory.value.push( {
        'pointindex': index,
        'annotatedBox': filteredPoints.value[index]?.annotedbox ?? null,
        'selectedPointIndex': selectedPointindex
    } );
    clearRedo();
};

const undo = ( redraw: () => void ) => {
    if ( undoHistory.value.length === 0 ) return;

    const last = undoHistory.value.pop()!;

    revision.value--;

    const currentPoint = filteredPoints.value[last.pointindex];

    redoHistory.value.push( {
        'pointindex': last.pointindex,
        'annotatedBox': currentPoint?.annotedbox ?? null,
        'selectedPointIndex': selectedPoint.value ? filteredPoints.value.indexOf( selectedPoint.value ) : -1
    } );


    selectedPoint.value = filteredPoints.value[last.selectedPointIndex]!;

    const point = filteredPoints.value[last.pointindex];

    if ( point ) {
        point.annotedbox = last.annotatedBox;
    }

    redraw();
};


export {
    clearRedo,
    redo,
    undo,
    addToHistory
};
