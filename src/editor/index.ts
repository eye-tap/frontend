import {
    type Ref,
    computed,
    onUnmounted
} from 'vue';
import {
    redoHistory,
    undoHistory
} from './manager/history';
import {
    editorSessionManager
} from './manager';
import {
    ioHandler
} from './io';
import {
    loadEditorDataFromBackend
} from './loaders/backend';
import {
    renderer
} from './render';
import {
    sendEditorLeaveEvent
} from './loaders/event';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';
import {
    useStatusStore
} from '@/ts/stores/status';

export const save = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:save' ) );
};

export const redoAvailable = computed( () => {
    return redoHistory.value.length > 0;
} );

export const undoAvailable = computed( () => {
    return undoHistory.value.length > 0;
} );

/** Redo an operation */
export const redo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:redo' ) );
};

/** Undo an operation */
export const undo = () => {
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
    const session = useAnnotationSessionStore();
    const status = useStatusStore();
    const draw = renderer( textCanvas, boxesCanvas, linesCanvas, fixationsCanvas, indicesCanvas, clickTarget );
    const io = ioHandler( clickTarget, draw );

    editorSessionManager( draw );

    if ( !status.devMode ) {
        loadEditorDataFromBackend( draw );
        session.createWatchIdx( () => {
            loadEditorDataFromBackend( draw );
        } );
    }

    onUnmounted( () => {
        sendEditorLeaveEvent();
    } );

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
