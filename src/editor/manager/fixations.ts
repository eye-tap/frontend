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
    hoveredFixation.value = getFixationIdByCoodianate( pos );

    if ( hoveredFixation.value === -1 ) return true;

    return false;
};
