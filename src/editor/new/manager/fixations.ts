import type {
    EditorPoint
} from '../types/annotation';
import {
    getFixationIdByCoodianate
} from '../association/fixations';

export const fixationHighlightHandler = ( pos: EditorPoint ): boolean => {
    const idx = getFixationIdByCoodianate( pos );

    if ( idx === -1 ) return false;

    return true;
};
