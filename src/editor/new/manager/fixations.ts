import type {
    EditorPoint
} from '../types/annotation';
import type {
    Renderer
} from '../types/renderer';
import {
    getFixationIdByCoodianate
} from '../association/fixations';

export const fixationHighlightHandler = ( renderer: Renderer ) => {
    return ( pos: EditorPoint ): boolean => {
        const idx = getFixationIdByCoodianate( pos );

        if ( idx === -1 ) return true;

        return false;
    };
};


// TODO: On load, got to assign the highlightClasses and assigned status

