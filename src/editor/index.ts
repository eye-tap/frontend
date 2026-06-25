import {
    type Ref,
    computed,
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue';
import {
    redoHistory,
    undoHistory
} from './manager/history';
import {
    resetSave,
    revision,
    savedAtRevision,
    useSaveFunction
} from './manager/save';
import {
    autoSaveInterval
} from './config';
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
    reloadThemeColours
} from './manager/theme';
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
    useExportFunction
} from './manager/export';
import {
    useStatusStore
} from '@/ts/stores/status';

export const isAutoSaveEnabled = ref( true );

/** Register auto-save capabilities. Auto-Save is disabled unless this function is called */
const useAutoSave = () => {
    let interval: number | undefined = undefined;

    watch( isAutoSaveEnabled, ( val, oldVal ) => {
        if ( !oldVal && val ) startHandler();
        else if ( oldVal && !val ) stopHandler();
    } );

    const startHandler = () => {
        interval = setInterval( () => {
            if ( isAutoSaveEnabled.value && saveNeeded.value ) {
                save();
            }
        }, autoSaveInterval.value * 1000 );
    };

    const stopHandler = () => {
        clearInterval( interval );
    };

    console.debug( '[EDITOR] Auto-Save enabled' );
    startHandler();
};

export const setAutoSave = ( enabled: boolean ) => {
    isAutoSaveEnabled.value = enabled;
};

export const save = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:save' ) );
};

export const exportAnnotations = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:export' ) );
};

export const redoAvailable = computed( () => {
    return redoHistory.value.length > 0;
} );

export const undoAvailable = computed( () => {
    return undoHistory.value.length > 0;
} );

export const saveNeeded = computed( () => {
    return revision.value !== savedAtRevision.value;
} );

/** Redo an operation */
export const redo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:redo' ) );
};

/** Undo an operation */
export const undo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:undo' ) );
};

export const markFixationAsInvalid = ( fixationIdx: number ) => {
    document.dispatchEvent( new CustomEvent( 'eyetap:keys:invalid', {
        'detail': fixationIdx
    } ) );
};

const start = (
    textCanvas: Ref<HTMLCanvasElement | null>,
    boxesCanvas: Ref<HTMLCanvasElement | null>,
    scanpathCanvas: Ref<HTMLCanvasElement | null>,
    linesCanvas: Ref<HTMLCanvasElement | null>,
    fixationsCanvas: Ref<HTMLCanvasElement | null>,
    indicesCanvas: Ref<HTMLCanvasElement | null>,
    clickTarget: Ref<HTMLCanvasElement | null>
) => {
    const session = useAnnotationSessionStore();
    const status = useStatusStore();
    const draw = renderer( textCanvas, boxesCanvas, scanpathCanvas, linesCanvas, fixationsCanvas, indicesCanvas, clickTarget );
    const io = ioHandler( clickTarget, draw );

    editorSessionManager( draw );
    useExportFunction();
    const saver = useSaveFunction();

    if ( !status.devMode ) {
        loadEditorDataFromBackend( draw );
        session.createWatchIdx( () => {
            resetSave();
            loadEditorDataFromBackend( draw );
        } );
    }

    onMounted( () => {
        document.addEventListener( 'eyetap:theme', reloadThemeColours );
        document.addEventListener( 'eyetap:timer-ended', save );
        reloadThemeColours();
        document.addEventListener( 'visibilitychange', leaveHandler );
    } );

    onUnmounted( () => {
        sendEditorLeaveEvent();

        try {
            document.removeEventListener( 'visibilitychange', leaveHandler );
        } catch { /* empty */ }

        try {
            document.removeEventListener( 'eyetap:theme', reloadThemeColours );
        } catch { /* empty */ }

        try {
            document.removeEventListener( 'eyetap:timer-ended', save );
        } catch { /* empty */ }
    } );

    const leaveHandler = () => {
        if ( document.hidden ) {
            saver();
        }
    };

    useAutoSave();

    return {
        'renderer': draw,
        'io': io
    };
};


export default {
    save,
    exportAnnotations,
    redo,
    undo,
    start,
    useAutoSave
};
