import {
    boundingBoxes,
    fixations
} from '../data';
import type {
    EditorPoint
} from '../types/annotation';

/**
 * Get the hovered character box index
 * @param pos - The position to calculate from
 * @returns The index of the bounding box that is exactly hit, or -1 if none
 */
export const getBoxIdFromCoordinate = ( pos: EditorPoint ): number => {
    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        const bb = boundingBoxes.value[i]!;

        if ( pos.x >= bb.xMin! && pos.x <= bb.xMax! && pos.y >= bb.yMin! && pos.y <= bb.yMax! ) {
            return i;
        }
    }

    return -1;
};

/**
 * Get the character box closest to the fixation id by its character
 * @param fixId - The fixation to start search from
 * @param char - The char to look for
 * @returns The index of the character box closest to the current fixation
 */
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
