import {
    boundingBoxes,
    fixations
} from '../data';
import type {
    EditorPoint
} from '../types/annotation';

export const getBoxIdFromCoordinate = ( pos: EditorPoint ): number => {
    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        const bb = boundingBoxes.value[i]!;

        if ( pos.x >= bb.xMin! && pos.x <= bb.xMax! && pos.y >= bb.yMin! && pos.y <= bb.yMax! ) {
            return i;
        }
    }

    return -1;
};

export const getClosestBoxIdByCharacterAndFixId = ( fixId: number, char: string ): number => {
    char = char.toLowerCase();

    if ( fixId < 0 ) return -1;

    let minDistanceIndex = -1;
    let minDistance = Number.MAX_VALUE;

    const pos = fixations.value[ fixId ]!;

    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        const bb = boundingBoxes.value[i]!;

        if ( bb.character!.toLowerCase() === char ) {
            const distance = Math.sqrt( Math.pow( bb.centerX - pos.x!, 2 ) + Math.pow( bb.centerY - pos.y!, 2 ) );

            if ( distance < minDistance ) {
                minDistanceIndex = i;
                minDistance = distance;
            }
        }
    }

    return minDistanceIndex;
};
