import type {
    EditorPoint
} from '../types/annotation';
import {
    fixations
} from '../data';
import {
    hoveredFixationRadius
} from '../config';

/**
 * Get the fixation that is hit exactly at this point
 * @param pos - The position to calculate from
 * @returns The index of the fixation that is exactly hit, or -1 if none
 */
export const getFixationIdByCoodianate = ( pos: EditorPoint ): number => {
    for ( let i = 0; i < fixations.value.length; i++ ) {
        const fix = fixations.value[i]!;

        if ( Math.sqrt( Math.pow( fix.x! - pos.x, 2 ) + Math.pow( fix.y! - pos.y, 2 ) ) < hoveredFixationRadius.value ) {
            return i;
        }
    }

    return -1;
};

/**
 * Get the closest fixation to passed in point
 * @param pos - The position to calculate from
 * @returns The index of closest fixation
 */
export const getClosestFixationIdByCoordinate = ( pos: EditorPoint ): number => {
    let minDistanceIndex = -1;
    let minDistance = Number.MAX_VALUE;

    for ( let i = 0; i < fixations.value.length; i++ ) {
        const fix = fixations.value[i]!;
        const distance = Math.sqrt( Math.pow( fix.x! - pos.x, 2 ) + Math.pow( fix.y! - pos.y, 2 ) );

        if ( distance < minDistance ) {
            minDistanceIndex = i;
            minDistance = distance;
        }
    }

    return minDistanceIndex;
};
