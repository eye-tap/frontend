import type {
    EditorPoint
} from '../types/annotation';
import {
    getFixationIdByCoodianate
} from '../association/fixations';
import {
    hoveredFixation
} from '../data';

// Sets the hovered fixation and returns if false if one is hovered
// (Why? See move manager)
export const fixationHighlightHandler = ( pos: EditorPoint ): boolean => {
    hoveredFixation.value = getFixationIdByCoodianate( pos );

    if ( hoveredFixation.value === -1 ) return true;

    return false;
};
