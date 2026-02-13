import type {
    EditorPoint
} from '../types/annotation';
import {
    boundingBoxes
} from '../data';

export const getBoxIdFromCoordinate = ( pos: EditorPoint ): number => {
    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        const bb = boundingBoxes.value[i]!;

        if ( pos.x >= bb.xMin! && pos.x <= bb.xMax! && pos.y >= bb.yMin! && pos.y <= bb.yMax! ) {
            return i;
        }
    }

    return -1;
};
