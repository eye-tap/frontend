import {
    type Ref,
    computed
} from 'vue';
import {
    redoHistory,
    undoHistory
} from './util/history';
import {
    editorSessionManager
} from './manager';
import {
    ioHandler
} from './io';
import {
    renderer
} from './render';

const save = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:save' ) );
};

const redoAvailable = computed( () => {
    return redoHistory.value.length > 0;
} );
const undoAvailable = computed( () => {
    return undoHistory.value.length > 0;
} );

/** Redo an operation */
const redo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:redo' ) );
};

/** Undo an operation */
const undo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:undo' ) );
};

const start = (
    textCanvas: Ref<HTMLCanvasElement | null>,
    boxesCanvas: Ref<HTMLCanvasElement | null>,
    linesCanvas: Ref<HTMLCanvasElement | null>,
    fixationsCanvas: Ref<HTMLCanvasElement | null>,
    indicesCanvas: Ref<HTMLCanvasElement | null>,
    clickTarget: Ref<HTMLCanvasElement | null>
) => {
    const draw = renderer( textCanvas, boxesCanvas, linesCanvas, fixationsCanvas, indicesCanvas, clickTarget );
    const io = ioHandler( clickTarget );

    editorSessionManager( draw );

    return {
        'renderer': draw,
        'io': io
    };
};

export default {
    save,
    redo,
    undo,
    redoAvailable,
    undoAvailable,
    start
};
