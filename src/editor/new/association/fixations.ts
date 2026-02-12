import {
    fixations
} from '../data';
import {
    pointRadius
} from '@/editor/config';

export const getFixationIdByCoodianate = ( x: number, y: number ): number => {
    for ( let i = 0; i < fixations.value.length; i++ ) {
        const fix = fixations.value[i]!;

        if ( Math.sqrt( Math.pow( fix.x! - x, 2 ) + Math.pow( fix.y! - y, 2 ) ) < 2 * pointRadius.value ) {
            return i;
        }
    }

    return -1;
};
