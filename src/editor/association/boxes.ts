import {
    boundingBoxes,
    fixations
} from '../data';
import type {
    EditorFixation
} from '../types/fixations';
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
 * @param dist - Distance (return the n-th closest, defaults to 1)
 * @returns The index of the character box closest to the current fixation
 */
export const getClosestBoxIdByCharacterAndFixId = ( fixId: number, char: string, dist = 1 ): number => {
    char = char.toLowerCase();

    if ( fixId < 0 ) return -1;

    const pos = fixations.value[ fixId ]!;

    if ( dist && dist > 1 ) {
        console.log( 'Distance', dist, 'key', char );
        const bbs = boundingBoxes.value
            .map( ( val, idx ) => {
                return {
                    'distance': Math.sqrt( Math.pow( val.centerX - pos.x!, 2 ) + Math.pow( val.centerY - pos.y!, 2 ) ),
                    'idx': idx,
                    'char': val.character!
                };
            } )
            .filter( val => val.char === char )
            .sort( ( a, b ) => {
                return a.distance - b.distance;
            } );

        return bbs[ dist - 1 ]!.idx;
    } else return oNBoxFinder( pos, char );
};

const oNBoxFinder = ( pos: EditorFixation, char: string ): number => {
    let minDistanceIndex = -1;
    let minDistance = Number.MAX_VALUE;

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
