import {
    algorithmsList,
    annotations,
    fixations,
    selectedAlgorithm,
    selectedFixation
} from '../data';
import {
    disableKeyHandler,
    keyboardZoomPanStep,
    keyboardZoomStep
} from '../config';
import {
    onMounted,
    onUnmounted
} from 'vue';
import {
    redo,
    save,
    undo
} from '..';
import type {
    Renderer
} from '../types/renderer';
import {
    annotationManager
} from '../manager/annotations';
import {
    getClosestBoxIdByCharacterAndFixId
} from '../association/boxes';
import {
    providedOffsetHandler
} from './zoom';
import zoom from '../manager/zoom';

export const keyboardHandler = ( renderer: Renderer ) => {
    const annotation = annotationManager( renderer );

    const handler = ( ev: KeyboardEvent ) => {
        if ( !disableKeyHandler.value ) {
            if ( isCharacterKey( ev.key ) && !ev.ctrlKey && !ev.metaKey && !ev.altKey ) {
                ev.preventDefault();
                annotation.create(
                    getClosestBoxIdByCharacterAndFixId( selectedFixation.value, ev.key ),
                    selectedFixation.value,
                    false,
                    true
                );
            } else if ( isUndoCmd( ev ) || ev.key === 'Backspace' || ev.key === 'Delete' ) {
                ev.preventDefault();
                undo();
            } else if ( isRedoCmd( ev ) ) {
                ev.preventDefault();
                redo();
            } else if ( ev.key === 's' && ev.ctrlKey ) {
                ev.preventDefault();
                save();
            } else if ( ev.key === '+' && ev.ctrlKey ) {
                ev.preventDefault();
                zoom.zoom( keyboardZoomStep.value, 'add' );
            } else if ( ev.key === '-' && ev.ctrlKey ) {
                ev.preventDefault();
                zoom.zoom( -keyboardZoomStep.value, 'add' );
            } else if ( ev.key.includes( 'Arrow' ) && ev.ctrlKey ) {
                ev.preventDefault();

                if ( ev.key === 'ArrowLeft' ) {
                    providedOffsetHandler( -keyboardZoomPanStep.value.x, 0 );
                } else if ( ev.key === 'ArrowRight' ) {
                    providedOffsetHandler( keyboardZoomPanStep.value.x, 0 );
                } else if ( ev.key === 'ArrowUp' ) {
                    providedOffsetHandler( -keyboardZoomPanStep.value.y, 0 );
                } else if ( ev.key === 'ArrowDown' ) {
                    providedOffsetHandler( keyboardZoomPanStep.value.y, 0 );
                }
            } else if ( ev.key === 'ArrowRight' ) {
                if ( selectedFixation.value > -1 ) {
                    selectedFixation.value = ( selectedFixation.value + 1 ) % fixations.value.length;
                }
            } else if ( ev.key === 'ArrowLeft' ) {
                if ( selectedFixation.value > -1 ) {
                    selectedFixation.value = ( selectedFixation.value - 1 ) % fixations.value.length;
                }
            } else if ( ev.key === 'Space' ) {
                ev.preventDefault();

                try {
                    annotation.create(
                        annotations.value.indexOf(
                            annotations.value.find( val => val.algorithm === algorithmsList.value[ selectedAlgorithm.value ]! )!
                        ),
                        selectedFixation.value,
                        false,
                        false
                    );
                } catch { /* empty */ }
            }
        }
    };

    onMounted( () => {
        document.addEventListener( 'keydown', handler );
    } );

    onUnmounted( () => {
        try {
            document.removeEventListener( 'keydown', handler );
        } catch { /* empty */ }
    } );
};

/**
 * @param key - The key that was pressed
 * @returns True if it is a key of a character
 */
const isCharacterKey = ( key: string ) => {
    return key.length === 1 && key.match( /[a-zA-Z0-9]/ );
};

/**
 * @param event - keys that were pressed
 * @returns True if it's Ctrl + z
 */
const isUndoCmd = ( event: KeyboardEvent ) => {
    return ( event.ctrlKey || event.metaKey ) && event.key.toLowerCase() === 'z';
};

/**
 * @param event - keys that were pressed
 * @returns True if it's Ctrl + y or Ctrl + Shift + z
 */
const isRedoCmd = ( event: KeyboardEvent ) => {
    return ( ( event.ctrlKey || event.metaKey ) && event.key.toLowerCase() === 'y' )
        || ( ( event.ctrlKey || event.metaKey ) && event.shiftKey && event.key.toLowerCase() === 'z' );
};
