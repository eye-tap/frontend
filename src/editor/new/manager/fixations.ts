import type {
    EditorPoint
} from '../types/annotation';
import {
    getFixationIdByCoodianate
} from '../association/fixations';
import {
    hoveredFixation
} from '../data';

export const fixationHighlightHandler = ( pos: EditorPoint ): boolean => {
    const idx = getFixationIdByCoodianate( pos );

    if ( idx === -1 ) return true;

    hoveredFixation.value = idx;

    return false;
};


// TODO: On load, got to assign the highlightClasses and assigned status
