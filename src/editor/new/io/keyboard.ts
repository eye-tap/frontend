import {
    onMounted,
    onUnmounted
} from 'vue';
import {
    disableKeyHandler
} from '../config';

export const keyboardHandler = () => {
    const handler = ( ev: KeyboardEvent ) => {
        if ( !disableKeyHandler.value ) {
            if ( isCharacterKey( ev.key ) ) {
                // Character key
            } else if ( isUndoCmd( ev ) ) {
                // Dispatch undo event
            } else if ( isRedoCmd( ev ) ) {
                // Dispatch redo event
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
