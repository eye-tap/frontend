import {
    redoHistory, undoHistory
} from './scripts/util/history-backend';
import {
    computed
} from 'vue';

const redoAvailable = computed( () => {
    return redoHistory.value.length > 0;
} );
const undoAvailable = computed( () => {
    return undoHistory.value.length > 0;
} );

const redo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:redo' ) );
};

const undo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:undo' ) );
};

export {
    undo,
    redo,
    redoAvailable,
    undoAvailable
};
