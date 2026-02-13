import type {
    EditorPoint
} from '../types/annotation';
import {
    fixations
} from '../data';
import {
    hoveredFixationRadius
} from '../config';

export const getFixationIdByCoodianate = ( pos: EditorPoint ): number => {
    for ( let i = 0; i < fixations.value.length; i++ ) {
        const fix = fixations.value[i]!;

        if ( Math.sqrt( Math.pow( fix.x! - pos.x, 2 ) + Math.pow( fix.y! - pos.y, 2 ) ) < hoveredFixationRadius.value ) {
            return i;
        }
    }

    return -1;
};

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
