import {
    fixations,
    hoveredFixation,
    selectedFixation,
    zoomFactor
} from '../data';
import type {
    EditorPoint
} from '../types/annotation';
import {
    getFixationIdByCoodianate
} from '../association/fixations';
import {
    mod
} from '../util/arithmetic';
import zoom from './zoom';

// Sets the hovered fixation and returns if false if one is hovered
// (Why? See move manager)
export const fixationHighlightHandler = ( pos: EditorPoint ): boolean => {
    hoveredFixation.value = getFixationIdByCoodianate( pos );

    if ( hoveredFixation.value === -1 ) return true;

    return false;
};

export const goToNextFixation = () => {
    selectFixation( selectedFixation.value + 1 );
};

export const goToPrevFixation = () => {
    selectFixation( selectedFixation.value - 1 );
};

const selectFixation = ( val: number ) => {
    if ( selectedFixation.value > -1 ) {
        selectedFixation.value = mod( val, fixations.value.length );

        if ( zoomFactor.value > 1 ) {
            zoom.setViewPortOriginFromCenter( {
                'x': fixations.value[ selectedFixation.value ]!.x!,
                'y': fixations.value[ selectedFixation.value ]!.y!
            } );
        }
    }
};
