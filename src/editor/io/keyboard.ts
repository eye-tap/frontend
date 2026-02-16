import {
    onMounted,
    onUnmounted
} from 'vue';
import {
    redo,
    undo
} from '..';
import type {
    Renderer
} from '../types/renderer';
import {
    annotationManager
} from '../manager/annotations';
import {
    disableKeyHandler
} from '../config';
import {
    getClosestBoxIdByCharacterAndFixId
} from '../association/boxes';
import {
    selectedFixation
} from '../data';

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
            }
        }
    };

    onMounted( () => {
        // TODO: See if this somehow interferes with interface elements
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
