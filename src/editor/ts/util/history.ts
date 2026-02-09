import {
    type Ref,
    computed,
    ref
} from 'vue';
import {
    filteredPoints,
    selectedPoint
} from '../data/internal-data';
import {
    revision
} from '../data/save';

interface RedoHistoryEntry {
    'index': number;
    'annotatedBox': string | number | null;
    'currentIndex': number;
}

const redoHistory: Ref<RedoHistoryEntry[]> = ref( [] );
const redoAvailable = computed( () => {
    return redoHistory.value.length > 0;
} );
const undoHistory: Ref<number[]> = ref( [] );
const undoAvailable = computed( () => {
    return undoHistory.value.length > 0;
} );

const clearRedo = () => {
    redoHistory.value = [];
};

const redo = ( redraw: () => void ) => {
    if ( redoHistory.value.length === 0 ) return;

    const last = redoHistory.value.pop()!;

    undoHistory.value.push( last.index );

    revision.value++;

    const point = filteredPoints.value[ last.index ];

    selectedPoint.value = filteredPoints.value[ last.currentIndex ]!;

    if ( point ) {
        point.annotedbox = last.annotatedBox;
        redraw();
    }
};

const addToHistory = ( index: number ) => {
    const existing = undoHistory.value.indexOf( index );

    revision.value++;

    if ( existing !== -1 ) undoHistory.value.splice( existing, 1 );

    undoHistory.value.push( index );
    clearRedo();
};

const undo = ( redraw: () => void ) => {
    if ( undoHistory.value.length === 0 ) return;

    const last = undoHistory.value.pop()!;
    const point = filteredPoints.value[last];
    const pointIdx = filteredPoints.value.indexOf( selectedPoint.value! );

    revision.value--;

    redoHistory.value.push( {
        'index': last,
        'annotatedBox': point!.annotedbox,
        'currentIndex': pointIdx
    } );

    selectedPoint.value = point!;

    if ( point ) {
        point.annotedbox = null;
        redraw();
    }
};


export {
    redoAvailable,
    undoAvailable,
    clearRedo,
    redo,
    undo,
    addToHistory
};
