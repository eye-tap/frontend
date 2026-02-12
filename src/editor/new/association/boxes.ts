import {
    boundingBoxes
} from '../data';

export const getBoxIdFromCoordinate = ( x: number, y: number ): number => {
    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        const bb = boundingBoxes.value[i]!;

        if ( x >= bb.xMin! && x <= bb.xMax! && y >= bb.yMin! && y <= bb.yMax! ) {
            return i;
        }
    }

    return -1;
};
