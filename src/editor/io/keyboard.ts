import {
    type LinesDisplay,
    disableKeyHandler,
    keyboardZoomPanStep,
    keyboardZoomStep,
    linesDisplay
} from '../config';
import {
    annotations,
    selectedFixation
} from '../data';
import {
    goToNextFixation,
    goToPrevFixation
} from '../manager/fixations';
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

    let prevSelectedDisplayMode: LinesDisplay = linesDisplay.value;

    const handler = ( ev: KeyboardEvent ) => {
        if ( !disableKeyHandler.value ) {
            if ( isCharacterKey( ev.key ) && !ev.ctrlKey && !ev.metaKey && !ev.altKey ) {
                // Character-based assignment
                ev.preventDefault();
                annotation.create(
                    getClosestBoxIdByCharacterAndFixId( selectedFixation.value, ev.key ),
                    selectedFixation.value,
                    false,
                    true
                );
            } else if ( ev.key === ' ' || ev.key === 'Space' || ev.code === 'Space' ) {
                // Confirm algorithm's suggested annotation
                ev.preventDefault();

                try {
                    annotation.create(
                        annotations.value.find( val => val.algorithm === 'default' && val.fixationIdx === selectedFixation.value )!.boxIdx,
                        selectedFixation.value,
                        false,
                        false
                    );
                } catch { /* empty */ }
            } else if ( isUndoCmd( ev ) ) {
                // Undo
                ev.preventDefault();
                undo();
            } else if ( isRedoCmd( ev ) ) {
                // redo
                ev.preventDefault();
                redo();
            } else if ( ( ev.key === 'Backspace' || ev.key === 'Delete' ) && !ev.shiftKey ) {
                // Delete annotation or move back
                if ( !annotation.deleteByFixID( selectedFixation.value, true ) ) {
                    goToPrevFixation();
                }
            } else if ( ev.key === 's' && ( ev.ctrlKey || ev.metaKey ) ) {
                // Save
                ev.preventDefault();
                save();
            } else if ( ev.key === '+' && ( ev.ctrlKey || ev.metaKey ) ) {
                // Zoom in
                ev.preventDefault();
                zoom.zoom( keyboardZoomStep.value, 'add' );
            } else if ( ev.key === '-' && ( ev.ctrlKey || ev.metaKey ) ) {
                // Zoom out
                ev.preventDefault();
                zoom.zoom( -keyboardZoomStep.value, 'add' );
            } else if ( ev.key.includes( 'Arrow' ) && ( ev.ctrlKey || ev.metaKey ) ) {
                // Pan zoomed view
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
                // Move to next fixation
                goToNextFixation();
            } else if ( ev.key === 'ArrowLeft' ) {
                // Move to previous fixation
                goToPrevFixation();
            } else if ( ( ev.key === 'Delete' || ev.key === 'Backspace' ) && ev.shiftKey ) {
                // Mark a fixation as invalid
                ev.preventDefault();
                annotation.markAsInvalid( selectedFixation.value );
            } else if ( ev.key === 'Enter' ) {
                // Show all algorithm's suggested annotations
                ev.preventDefault();

                if ( linesDisplay.value !== 'allalgos' ) {
                    prevSelectedDisplayMode = linesDisplay.value;
                    linesDisplay.value = 'allalgos';
                }
            }
        }
    };

    const keyUpHandler = ( ev: KeyboardEvent ) => {
        if ( ev.key === 'Enter' ) {
            // Disable the algorithm's suggested annotations
            ev.preventDefault();
            linesDisplay.value = prevSelectedDisplayMode;
        }
    };

    onMounted( () => {
        document.addEventListener( 'keydown', handler );
        document.addEventListener( 'keyup', keyUpHandler );
    } );

    onUnmounted( () => {
        try {
            document.removeEventListener( 'keydown', handler );
        } catch { /* empty */ }

        try {
            document.removeEventListener( 'keyup', keyUpHandler );
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
